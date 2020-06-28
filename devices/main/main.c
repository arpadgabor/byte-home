#include <stdio.h>
#include <string.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_system.h"
#include "esp_log.h"
#include "wifi_manager.h"
#include "mdf_common.h"
#include "mwifi.h"
#include "sdkconfig.h"
// #include "driver/gpio.h"
#include "wifimesh.h"
#include "device.h"
#include "dht.h"

#define MODE_NO_NET 0

static const dht_sensor_type_t sensor_type = DHT_TYPE_AM2301;
static const gpio_num_t sensor_gpio = 4;
// #define SENSOR_GPIO 4

static const char TAG[] = "BYTE";

// void send_data(int status)
// {
// 	char *msg;
// 	asprintf(&msg, 
// 		"{ \"sensors\": { \"bool\": %d } }",
// 		status
// 	);
// 	node_write_task(msg);
// 	free(msg);
// }


void read_dht(void *pvParameters)
{
	int16_t temperature = 0;
	int16_t humidity = 0;
	int delay = 10000; //ms

	for(;;)
	{
		if (dht_read_data(sensor_type, sensor_gpio, &humidity, &temperature) == ESP_OK) {
			char *msg;
			asprintf(&msg, 
				"{ \"sensors\": { \"humidity\": %.1f, \"temperature\": %.1f } }",
				(float)humidity/10, (float)temperature/10
			);
			node_write_task(msg);
			free(msg);
		}
		else {
			ESP_LOGW(TAG, "Could not read data from sensor\n");
		}

		vTaskDelay(pdMS_TO_TICKS(delay));
	}
}

void msg_data_handler(char *data)
{
	ESP_LOGI(TAG, "%s", data);
}

// void cb_sensor_task(void *params)
// {
// 	int sensor_status = -1;
// 	int sensor_check;

// 	gpio_pad_select_gpio(SENSOR_GPIO);
// 	gpio_set_direction(SENSOR_GPIO, GPIO_MODE_INPUT);

// 	for(;;)
// 	{
// 		sensor_check = gpio_get_level(SENSOR_GPIO);
// 		if(sensor_check != sensor_status)
// 		{
// 			send_data(sensor_check);
// 			sensor_status = sensor_check;
// 			ESP_LOGI(TAG, "%d", gpio_get_level(SENSOR_GPIO));
// 		}
// 		vTaskDelay(1000 / portTICK_PERIOD_MS);
// 	}
// }

void cb_device_start()
{
	xTaskCreate(read_dht, "read_dht", configMINIMAL_STACK_SIZE * 3, NULL, 5, NULL);
}



void app_main()
{
	char *device_map = "{ \"sensors\": [{ \"type\": \"humidity\", \"unit\": \"%%\" }, { \"type\": \"temperature\", \"unit\": \"C\" }] }";

	if(!MODE_NO_NET) {
		ESP_LOGI(TAG, "Boot OK.");
		start_device(device_map, &cb_device_start);
	} else {
		ESP_LOGE(TAG, "MODE_NO_NET is ON!");
	}
}
