#include <stdio.h>
#include <string.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_system.h"
#include "esp_log.h"
#include "wifi_manager.h"
#include "wifimesh.h"
#include "mdf_common.h"
#include "mwifi.h"

static const char TAG[] = "BYTE";

void cb_connection_ok(void *pvParameter){
	ESP_LOGE(TAG, "WIFI 1 CONNECTED!");
	esp_restart();
}

void app_main()
{
	nvs_flash_init();

	if(wifi_manager_fetch_wifi_sta_config()) {
		initMesh();
	} else {
		wifi_manager_start();
		wifi_manager_set_callback(EVENT_STA_GOT_IP, &cb_connection_ok);
	}

}
