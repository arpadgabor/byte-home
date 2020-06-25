#include <stdio.h>
#include <string.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_system.h"
#include "esp_log.h"
#include "wifi_manager.h"
#include "mdf_common.h"
#include "mwifi.h"
#include "wifimesh.h"
#include "device.h"

static const char TAG[] = "BYTE";

int read_uuid()
{
	nvs_handle handle;
	ESP_LOGI(TAG, "Reading UUID");

	if(nvs_open("devid", NVS_READONLY, &handle) == ESP_OK){
		ESP_LOGI(TAG, "NVS Open");

		device_uuid = (char*)malloc(sizeof(char[36]));
		memset(device_uuid, 0x00, sizeof(char[36]));

		size_t sz = sizeof(char[36]);
		uint8_t *buff = (uint8_t*)malloc(sizeof(uint8_t) * sz);
		memset(buff, 0x00, sizeof(char[36]));

		esp_err_t esp_err = nvs_get_blob(handle, "devid", buff, &sz);

		if(esp_err != ESP_OK){
			free(buff);
			return 0;
		}

		memcpy(device_uuid, buff, sz);
		device_uuid[36] = '\0';
		ESP_LOGI(TAG, "UUID: %s", device_uuid);

		return 1;
	}

	ESP_LOGE(TAG, "Could not read UUID");
	return 0;
}

int write_uuid(char *uuid)
{
	nvs_handle handle;

	ESP_LOGI(TAG, "Writing UUID %s", uuid);

	nvs_open("devid", NVS_READWRITE, &handle);
	esp_err_t esp_err = nvs_set_blob(handle, "devid", uuid, 36);

	if(esp_err != ESP_OK) {
		ESP_LOGE(TAG, "Failed to write UUID");
		return 0;
	}

	return 1;
}

void cb_connection_ok(void *pvParameter)
{
	ESP_LOGE(TAG, "WIFI 1 CONNECTED!");
	esp_restart();
}

void start_device(char *device_map, void (*cb)())
{
	nvs_flash_init();

	if(wifi_manager_fetch_wifi_sta_config()) {
		mesh_start();

		ESP_LOGW(TAG, "Waiting 20s for connection...");
		vTaskDelay(20000 / portTICK_PERIOD_MS);

		if(read_uuid()) {
			ESP_LOGW(TAG, "Device online");
			(*cb)();
		} else {
			ESP_LOGW(TAG, "Setting up device...");

			device_uuid = malloc(sizeof(char[3]));
			strcpy(device_uuid, "");

			node_write_task(device_map);
		}
	} else {
		wifi_manager_start();
		wifi_manager_set_callback(EVENT_STA_GOT_IP, &cb_connection_ok);
	}
}