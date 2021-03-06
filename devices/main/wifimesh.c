#include "mdf_common.h"
#include "mwifi.h"
#include "mesh_mqtt_handle.h"
#include "sdkconfig.h"
#include "wifimesh.h"
#include "wifi_manager.h"

typedef struct {
	size_t last_num;
	uint8_t *last_list;
	size_t change_num;
	uint8_t *change_list;
} node_list_t;

TaskHandle_t xRebootHandler = NULL;

static const char *TAG = "MESH";

static bool addrs_remove(uint8_t *addrs_list, size_t *addrs_num, const uint8_t *addr)
{
	for (int i = 0; i < *addrs_num; i++, addrs_list += MWIFI_ADDR_LEN) {
		if (!memcmp(addrs_list, addr, MWIFI_ADDR_LEN)) {
			if (--(*addrs_num)) {
				memcpy(addrs_list, addrs_list + MWIFI_ADDR_LEN, (*addrs_num - i) * MWIFI_ADDR_LEN);
			}
			return true;
		}
	}

	return false;
}

void msg_handler(char *msg)
{
	// Respond to ping messages
	if(strstr(msg, "ping") != NULL) {
		node_write_task("ping");

	// Save UUID of the device and restart
	} else if(strstr(msg, "uuid") != NULL) {
		char buff[42];
		strcpy(buff, msg);
		strtok(msg, ":");
		char *uuid = strtok(NULL, ":");

		write_uuid(uuid);
		esp_restart();

	// If the message is anything else, implement custom handler
	} else {
		msg_data_handler(msg);
	}
}

/// Waits 90 seconds before rebooting
/// Task will not run if the device reconnects
/// Check event_loop_cb: case MDF_EVENT_MWIFI_PARENT_CONNECTED
void reboot_on_inactive(void *arg)
{
	ESP_LOGW(TAG, "Preparing to reboot - Disconnected.");
	vTaskDelay(pdMS_TO_TICKS(90 * 1000));
	esp_restart();
}

void root_write_task(void *arg)
{
	mdf_err_t ret = MDF_OK;
	char *data    = NULL;
	size_t size   = MWIFI_PAYLOAD_LEN;
	uint8_t src_addr[MWIFI_ADDR_LEN] = {0x0};
	mwifi_data_type_t data_type      = {0x0};

	MDF_LOGI("ROOT WRITE INIT");

	while (mwifi_is_connected() && esp_mesh_get_layer() == MESH_ROOT) {
		if (!mesh_mqtt_is_connect()) {
			vTaskDelay(500 / portTICK_RATE_MS);
			continue;
		}

		/**
		 * @brief Recv data from node, and forward to mqtt server.
		 */
		ret = mwifi_root_read(src_addr, &data_type, &data, &size, portMAX_DELAY);
		MDF_ERROR_GOTO(ret != MDF_OK, MEM_FREE, "<%s> mwifi_root_read", mdf_err_to_name(ret));

		ret = mesh_mqtt_write(src_addr, data, size);
		MDF_ERROR_GOTO(ret != MDF_OK, MEM_FREE, "<%s> mesh_mqtt_publish", mdf_err_to_name(ret));

MEM_FREE:
		MDF_FREE(data);
	}

	MDF_LOGW("ROOT WRITE EXIT");
	mesh_mqtt_stop();
	vTaskDelete(NULL);
}

void root_read_task(void *arg)
{
	mdf_err_t ret = MDF_OK;
	char *data    = NULL;
	size_t size   = MWIFI_PAYLOAD_LEN;
	uint8_t dest_addr[MWIFI_ADDR_LEN] = {0x0};
	mwifi_data_type_t data_type       = {0x0};

	MDF_LOGI("ROOT READ INIT");

	while (mwifi_is_connected() && esp_mesh_get_layer() == MESH_ROOT) {
		if (!mesh_mqtt_is_connect()) 
		{
			vTaskDelay(500 / portTICK_RATE_MS);
			continue;
		}

		/**
		 * @brief Recv data from mqtt data queue, and forward to special device.
		 */
		ret = mesh_mqtt_read(dest_addr, (void **)&data, &size, 500 / portTICK_PERIOD_MS);
		MDF_ERROR_GOTO(ret != MDF_OK, MEM_FREE, "");

		ret = mwifi_root_write(dest_addr, 1, &data_type, data, size, true);
		if(ret == ESP_ERR_MESH_NO_ROUTE_FOUND) {
			msg_handler(data);
			goto MEM_FREE;
		}
		MDF_ERROR_GOTO(ret != MDF_OK, MEM_FREE, "<%s> mwifi_root_write", mdf_err_to_name(ret));

MEM_FREE:
		MDF_FREE(data);
	}

	MDF_LOGW("ROOT READ EXIT");
	mesh_mqtt_stop();
	vTaskDelete(NULL);
}

static void node_read_task(void *arg)
{
	mdf_err_t ret = MDF_OK;
	char *data    = MDF_MALLOC(MWIFI_PAYLOAD_LEN);
	size_t size   = MWIFI_PAYLOAD_LEN;
	mwifi_data_type_t data_type      = {0x0};
	uint8_t src_addr[MWIFI_ADDR_LEN] = {0x0};

	MDF_LOGI("NODE READ INIT");

	for (;;) {
		if (!mwifi_is_connected()) {
			vTaskDelay(pdMS_TO_TICKS(500));
			continue;
		}

		size = MWIFI_PAYLOAD_LEN;
		memset(data, 0, MWIFI_PAYLOAD_LEN);
		ret = mwifi_read(src_addr, &data_type, data, &size, portMAX_DELAY);
		MDF_ERROR_CONTINUE(ret != MDF_OK, "<%s> mwifi_read", mdf_err_to_name(ret));
		MDF_LOGD("Node receive: " MACSTR ", size: %d, data: %s", MAC2STR(src_addr), size, data);

		msg_handler(data);
	}

	MDF_LOGW("NODE READ EXIT");
	MDF_FREE(data);
	vTaskDelete(NULL);
}

int node_write_task(char *msg)
{
	mdf_err_t ret = MDF_OK;
	size_t size   = 0;
	char *data    = NULL;
	mwifi_data_type_t data_type     = {0x0};
	uint8_t sta_mac[MWIFI_ADDR_LEN] = {0};

	if(!mwifi_is_connected())
	{
		ESP_LOGE(TAG, "ERR1: Not connected to mesh!");
		return 1;
	}

	if(!mwifi_get_root_status())
	{
		ESP_LOGE(TAG, "ERR2: Not connected to root!");
		return 2;
	}

	esp_wifi_get_mac(ESP_IF_WIFI_STA, sta_mac);

	size = asprintf(&data, "\
		{\"mac\": \"%02x%02x%02x%02x%02x%02x\",\"uuid\": \"%s\",\"layer\": %d,\"msg\": %s}",
		MAC2STR(sta_mac), device_uuid, esp_mesh_get_layer(), msg);

	MDF_LOGD("Node send, size: %d, data: %s", size, data);
	ret = mwifi_write(NULL, &data_type, data, size, true);
	MDF_FREE(data);

	if(ret != MDF_OK)
	{
		ESP_LOGE(TAG, "ERR3: Could not send message!");
		return 3;
	}

	return 0;
}

static mdf_err_t wifi_init()
{
	mdf_err_t ret          = nvs_flash_init();
	wifi_init_config_t cfg = WIFI_INIT_CONFIG_DEFAULT();

	if (ret == ESP_ERR_NVS_NO_FREE_PAGES || ret == ESP_ERR_NVS_NEW_VERSION_FOUND) {
		MDF_ERROR_ASSERT(nvs_flash_erase());
		ret = nvs_flash_init();
	}

	MDF_ERROR_ASSERT(ret);

	tcpip_adapter_init();
	MDF_ERROR_ASSERT(esp_wifi_init(&cfg));
	MDF_ERROR_ASSERT(esp_wifi_set_storage(WIFI_STORAGE_FLASH));
	MDF_ERROR_ASSERT(esp_wifi_set_mode(WIFI_MODE_STA));
	MDF_ERROR_ASSERT(esp_wifi_set_ps(WIFI_PS_NONE));
	MDF_ERROR_ASSERT(esp_mesh_set_6m_rate(false));
	ESP_ERROR_CHECK(esp_wifi_set_config(WIFI_IF_STA, wifi_manager_get_wifi_sta_config()));
	MDF_ERROR_ASSERT(esp_wifi_start());

	ESP_LOGI(TAG, "WIFI 2 CONNECTED");
	return MDF_OK;

}

static mdf_err_t event_loop_cb(mdf_event_loop_t event, void *ctx)
{
	static node_list_t node_list = {0x0};

	MDF_LOGI("event_loop_cb, event: %d", event);

	switch (event) {
		case MDF_EVENT_MWIFI_STARTED:
			MDF_LOGI("MESH is started");
			
			break;

		case MDF_EVENT_MWIFI_PARENT_CONNECTED:
			MDF_LOGI("ROOT is connected on station interface");

			if( xRebootHandler != NULL ) {
				ESP_LOGW(TAG, "Aborting reboot - Connected.");
				vTaskDelete(xRebootHandler);
			}

			break;

		case MDF_EVENT_MWIFI_PARENT_DISCONNECTED:
			MDF_LOGI("ROOT is disconnected on station interface");

			if (esp_mesh_is_root()) {
				mesh_mqtt_stop();
			} else {
				xTaskCreate(reboot_on_inactive, "reboot_inactive", 4 * 1024,
						NULL, CONFIG_MDF_TASK_DEFAULT_PRIOTY, &xRebootHandler);
			}
			break;

		case MDF_EVENT_MWIFI_ROUTING_TABLE_ADD:
			MDF_LOGI("MDF_EVENT_MWIFI_ROUTING_TABLE_ADD, total_num: %d", esp_mesh_get_total_node_num());

			if (esp_mesh_is_root()) {

				/**
				 * @brief find new add device.
				 */
				node_list.change_num  = esp_mesh_get_routing_table_size();
				node_list.change_list = MDF_MALLOC(node_list.change_num * sizeof(mesh_addr_t));

				ESP_ERROR_CHECK(esp_mesh_get_routing_table((mesh_addr_t *)node_list.change_list,
								node_list.change_num * sizeof(mesh_addr_t), (int *)&node_list.change_num));

				for (int i = 0; i < node_list.last_num; ++i) {
					addrs_remove(node_list.change_list, &node_list.change_num, node_list.last_list + i * MWIFI_ADDR_LEN);
				}

				node_list.last_list = MDF_REALLOC(node_list.last_list, (node_list.change_num + node_list.last_num) * MWIFI_ADDR_LEN);

				memcpy(node_list.last_list + node_list.last_num * MWIFI_ADDR_LEN, node_list.change_list, node_list.change_num * MWIFI_ADDR_LEN);
				node_list.last_num += node_list.change_num;

				/**
				 * @brief subscribe topic for new node
				 */
				MDF_LOGI("total_num: %d, add_num: %d", node_list.last_num, node_list.change_num);
				mesh_mqtt_subscribe(node_list.change_list, node_list.change_num);
				// mesh_mqtt_write();
				MDF_FREE(node_list.change_list);
			}

			break;

		case MDF_EVENT_MWIFI_ROUTING_TABLE_REMOVE:
			MDF_LOGI("MDF_EVENT_MWIFI_ROUTING_TABLE_REMOVE, total_num: %d", esp_mesh_get_total_node_num());

			if (esp_mesh_is_root()) {
				/**
				 * @brief find removed device.
				 */
				size_t table_size      = esp_mesh_get_routing_table_size();
				uint8_t *routing_table = MDF_MALLOC(table_size * sizeof(mesh_addr_t));
				ESP_ERROR_CHECK(esp_mesh_get_routing_table((mesh_addr_t *)routing_table,
								table_size * sizeof(mesh_addr_t), (int *)&table_size));

				for (int i = 0; i < table_size; ++i) {
					addrs_remove(node_list.last_list, &node_list.last_num, routing_table + i * MWIFI_ADDR_LEN);
				}

				node_list.change_num  = node_list.last_num;
				node_list.change_list = MDF_MALLOC(node_list.last_num * MWIFI_ADDR_LEN);
				memcpy(node_list.change_list, node_list.last_list, node_list.change_num * MWIFI_ADDR_LEN);

				node_list.last_num  = table_size;
				memcpy(node_list.last_list, routing_table, table_size * MWIFI_ADDR_LEN);
				MDF_FREE(routing_table);

				/**
				 * @brief unsubscribe topic for leaved node
				 */
				MDF_LOGI("total_num: %d, add_num: %d", node_list.last_num, node_list.change_num);
				mesh_mqtt_unsubscribe(node_list.change_list, node_list.change_num);
				MDF_FREE(node_list.change_list);
			}

			break;

		case MDF_EVENT_MWIFI_ROOT_GOT_IP:
			MDF_LOGI("Root obtains the IP address. It is posted by LwIP stack automatically");

			mesh_mqtt_start(CONFIG_MQTT_URL);

			/**
			 * @brief subscribe topic for all subnode
			 */
			size_t table_size      = esp_mesh_get_routing_table_size();
			uint8_t *routing_table = MDF_MALLOC(table_size * sizeof(mesh_addr_t));
			ESP_ERROR_CHECK(esp_mesh_get_routing_table((mesh_addr_t *)routing_table,
							table_size * sizeof(mesh_addr_t), (int *)&table_size));

			node_list.last_num  = table_size;
			node_list.last_list = MDF_REALLOC(node_list.last_list,
											  node_list.last_num * MWIFI_ADDR_LEN);
			memcpy(node_list.last_list, routing_table, table_size * MWIFI_ADDR_LEN);
			MDF_FREE(routing_table);

			MDF_LOGI("subscribe %d node", node_list.last_num);
			mesh_mqtt_subscribe(node_list.last_list, node_list.last_num);
			MDF_FREE(node_list.change_list);

			xTaskCreate(root_write_task, "root_write", 4 * 1024,
						NULL, CONFIG_MDF_TASK_DEFAULT_PRIOTY, NULL);
			xTaskCreate(root_read_task, "root_read", 4 * 1024,
						NULL, CONFIG_MDF_TASK_DEFAULT_PRIOTY, NULL);
			break;
		case MDF_EVENT_CUSTOM_MQTT_CONNECT:
			MDF_LOGI("MQTT connect");
			mwifi_post_root_status(true);
			break;

		case MDF_EVENT_CUSTOM_MQTT_DISCONNECT:
			MDF_LOGI("MQTT disconnected");
			mwifi_post_root_status(false);
			break;

		default:
			break;
	}

	return MDF_OK;
}

int mesh_start()
{
	char* ssid = (char*)wifi_manager_config_sta->sta.ssid;
	char* password = (char*)wifi_manager_config_sta->sta.password;

	mwifi_init_config_t cfg   = MWIFI_INIT_CONFIG_DEFAULT();

	mwifi_config_t config = {
		.mesh_id         = CONFIG_MESH_ID,
		.mesh_password   = CONFIG_MESH_PASSWORD,
	};

	strcpy((char*)config.router_ssid, ssid);
	strcpy((char*)config.router_password, password);

	printf("ssid: %s, password: %s, meshid: %s, meshpw: %s",
			config.router_ssid, config.router_password, 
			CONFIG_MESH_ID, CONFIG_MESH_PASSWORD);

	esp_log_level_set("*", ESP_LOG_INFO);
	esp_log_level_set(TAG, ESP_LOG_DEBUG);

	ESP_ERROR_CHECK(esp_event_loop_init(NULL, NULL));
	MDF_ERROR_ASSERT(mdf_event_loop_init(event_loop_cb));
	MDF_ERROR_ASSERT(wifi_init());
	MDF_ERROR_ASSERT(mwifi_init(&cfg));
	MDF_ERROR_ASSERT(mwifi_set_config(&config));
	MDF_ERROR_ASSERT(mwifi_start());

	xTaskCreate(node_read_task, "node_read_task", 4 * 1024,
				NULL, CONFIG_MDF_TASK_DEFAULT_PRIOTY, NULL);

	return 1;
}
