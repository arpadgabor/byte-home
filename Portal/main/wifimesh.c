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

static const char *TAG = "MESH";
int led = 0;

/**
 * @brief Timed printing system information
 */
static void print_system_info_timercb()
{
    uint8_t primary                 = 0;
    wifi_second_chan_t second       = 0;
    mesh_addr_t parent_bssid        = {0};
    uint8_t sta_mac[MWIFI_ADDR_LEN] = {0};
    mesh_assoc_t mesh_assoc         = {0x0};
    wifi_sta_list_t wifi_sta_list   = {0x0};

    esp_wifi_get_mac(ESP_IF_WIFI_STA, sta_mac);
    esp_wifi_ap_get_sta_list(&wifi_sta_list);
    esp_wifi_get_channel(&primary, &second);
    esp_wifi_vnd_mesh_get(&mesh_assoc);
    esp_mesh_get_parent_bssid(&parent_bssid);

    MDF_LOGI("System information, channel: %d, layer: %d, self mac: " MACSTR ", parent bssid: " MACSTR
             ", parent rssi: %d, node num: %d, free heap: %u", primary,
             esp_mesh_get_layer(), MAC2STR(sta_mac), MAC2STR(parent_bssid.addr),
             mesh_assoc.rssi, esp_mesh_get_total_node_num(), esp_get_free_heap_size());

	if(esp_mesh_is_root()) {
		MDF_LOGI("THIS IS ROOT");
	}

    for (int i = 0; i < wifi_sta_list.num; i++) {
        MDF_LOGI("Child mac: " MACSTR, MAC2STR(wifi_sta_list.sta[i].mac));
    }

#ifdef MEMORY_DEBUG

    if (!heap_caps_check_integrity_all(true)) {
        MDF_LOGE("At least one heap is corrupt");
    }

    mdf_mem_print_heap();
    mdf_mem_print_record();
    mdf_mem_print_task();
#endif /**< MEMORY_DEBUG */
}

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
			ESP_LOGW(TAG, "MQTT Not Connected [RW]");
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
		if (!mesh_mqtt_is_connect()) {
			ESP_LOGW(TAG, "MQTT Not Connected [RR]");
			vTaskDelay(500 / portTICK_RATE_MS);
			continue;
		}

		/**
		 * @brief Recv data from mqtt data queue, and forward to special device.
		 */
		ret = mesh_mqtt_read(dest_addr, (void **)&data, &size, 500 / portTICK_PERIOD_MS);
		MDF_ERROR_GOTO(ret != MDF_OK, MEM_FREE, "");

		ret = mwifi_root_write(dest_addr, 1, &data_type, data, size, true);
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
			ESP_LOGW(TAG, "Not reading data [NR]");
			vTaskDelay(500 / portTICK_RATE_MS);
			continue;
		}

		size = MWIFI_PAYLOAD_LEN;
		memset(data, 0, MWIFI_PAYLOAD_LEN);
		ret = mwifi_read(src_addr, &data_type, data, &size, portMAX_DELAY);
		MDF_ERROR_CONTINUE(ret != MDF_OK, "<%s> mwifi_read", mdf_err_to_name(ret));
		MDF_LOGD("Node receive: " MACSTR ", size: %d, data: %s", MAC2STR(src_addr), size, data);
		printf(data);
	}

	MDF_LOGW("NODE READ EXIT");
	MDF_FREE(data);
	vTaskDelete(NULL);
}

static void node_write_task(void *arg)
{
	mdf_err_t ret = MDF_OK;
	int count     = 0;
	size_t size   = 0;
	char *data    = NULL;
	mwifi_data_type_t data_type     = {0x0};
	uint8_t sta_mac[MWIFI_ADDR_LEN] = {0};

	MDF_LOGI("NODE WRITE INIT");

	esp_wifi_get_mac(ESP_IF_WIFI_STA, sta_mac);

	for (;;) {
		if(mwifi_is_connected())
			ESP_LOGI(TAG, "MWIFI CONN");
		else ESP_LOGW(TAG, "MWIFI NOT CONN");

		if(mwifi_get_root_status())
			ESP_LOGI(TAG, "HAS ROOT");
		else ESP_LOGW(TAG, "NO ROOT");
		
		if (!mwifi_is_connected() || !mwifi_get_root_status()) {
			ESP_LOGW(TAG, "Not sending data [NW]");
			vTaskDelay(500 / portTICK_RATE_MS);
			continue;
		}

		/**
		 * @brief Send device information to mqtt server throught root node.
		 */
		size = asprintf(&data, "{\"mac\": \"%02x%02x%02x%02x%02x%02x\", \"seq\":%d,\"layer\":%d\"msg\": \"Sorry losers and haters, but my IQ is one of the highest any you all know it! -Donald Trump\"}",
						MAC2STR(sta_mac), count++, esp_mesh_get_layer());

		MDF_LOGD("Node send, size: %d, data: %s", size, data);
		ret = mwifi_write(NULL, &data_type, data, size, true);
		MDF_FREE(data);
		MDF_ERROR_CONTINUE(ret != MDF_OK, "<%s> mwifi_write", mdf_err_to_name(ret));

		vTaskDelay(3000 / portTICK_RATE_MS);
	}

	MDF_LOGW("NODE WRITE EXIT");
	vTaskDelete(NULL);
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

/**
 * @brief All module events will be sent to this task in esp-mdf
 *
 * @Note:
 *     1. Do not block or lengthy operations in the callback function.
 *     2. Do not consume a lot of memory in the callback function.
 *        The task memory of the callback function is only 4KB.
 */
static mdf_err_t event_loop_cb(mdf_event_loop_t event, void *ctx)
{
	MDF_LOGI("event_loop_cb, event: %d", event);
	static node_list_t node_list = {0x0};

	switch (event) {
		case MDF_EVENT_MWIFI_STARTED:
			MDF_LOGI("MESH is started");
			break;

		case MDF_EVENT_MWIFI_PARENT_CONNECTED:
			MDF_LOGI("ROOT is connected on station interface");
			break;

		case MDF_EVENT_MWIFI_PARENT_DISCONNECTED:
			MDF_LOGI("ROOT is disconnected on station interface");

			if (esp_mesh_is_root()) {
				mesh_mqtt_stop();
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

				node_list.last_list = MDF_REALLOC(node_list.last_list,
												  (node_list.change_num + node_list.last_num) * MWIFI_ADDR_LEN);
				memcpy(node_list.last_list + node_list.last_num * MWIFI_ADDR_LEN,
					   node_list.change_list, node_list.change_num * MWIFI_ADDR_LEN);
				node_list.last_num += node_list.change_num;

				/**
				 * @brief subscribe topic for new node
				 */
				MDF_LOGI("total_num: %d, add_num: %d", node_list.last_num, node_list.change_num);
				mesh_mqtt_subscribe(node_list.change_list, node_list.change_num);
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

void initMesh()
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

	/**
	 * @brief Set the log level for serial port printing.
	 */
	esp_log_level_set("*", ESP_LOG_INFO);
	esp_log_level_set(TAG, ESP_LOG_DEBUG);

	/**
	 * @brief Initialize wifi mesh.
	 */
	ESP_ERROR_CHECK(esp_event_loop_init(NULL, NULL));
	MDF_ERROR_ASSERT(mdf_event_loop_init(event_loop_cb));
    MDF_ERROR_ASSERT(wifi_init());
    MDF_ERROR_ASSERT(mwifi_init(&cfg));
    MDF_ERROR_ASSERT(mwifi_set_config(&config));
    MDF_ERROR_ASSERT(mwifi_start());

	/**
	 * @brief Create node handler
	 */
	xTaskCreate(node_write_task, "node_write_task", 4 * 1024,
				NULL, CONFIG_MDF_TASK_DEFAULT_PRIOTY, NULL);
	xTaskCreate(node_read_task, "node_read_task", 4 * 1024,
				NULL, CONFIG_MDF_TASK_DEFAULT_PRIOTY, NULL);

	TimerHandle_t timer = xTimerCreate("print_system_info", 10000 / portTICK_RATE_MS,true, NULL, print_system_info_timercb);
	xTimerStart(timer, 0);
}