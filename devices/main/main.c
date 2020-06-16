#include <stdio.h>
#include <string.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_system.h"
#include "esp_log.h"
#include "wifi_manager.h"
#include "mdf_common.h"
#include "mwifi.h"
// #include "dht.h"
#include "driver/gpio.h"
#include "wifimesh.h"
#include "device.h"

#define NUM_LEDS 30
#include "led_strip.h"
// static const dht_sensor_type_t sensor_type = DHT_TYPE_AM2301;
// static const gpio_num_t sensor_gpio = 4;
#define SENSOR_GPIO 4
#define MODE_NO_NET 1

#define RED   0xFF0000
#define GREEN 0x00FF00
#define BLUE  0x0000FF

static const char TAG[] = "BYTE";

/*
void read_dht(void *pvParameters)
{
	int16_t temperature = 0;
	int16_t humidity = 0;
	float delay = 10000; //ms

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

			ESP_LOGI(TAG, "Humidity: %d%% Temp: %dC\n", humidity, temperature);
		}
		else
			ESP_LOGW(TAG, "Could not read data from sensor\n");

		vTaskDelay((int)delay / portTICK_PERIOD_MS);
	}
}
*/

void send_data(int status)
{
	char *msg;
	asprintf(&msg, 
		"{ \"sensors\": { \"bool\": %d } }",
		status
	);
	node_write_task(msg);
	free(msg);
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

void cb_test()
{
	uint8_t sta_mac[MWIFI_ADDR_LEN] = {0};
	esp_wifi_get_mac(ESP_IF_WIFI_STA, sta_mac);
	for(;;)
	{
		ESP_LOGI(TAG, "Mac: %02x:%02x:%02x:%02x:%02x:%02x", MAC2STR(sta_mac));
		vTaskDelay(1000 / portTICK_PERIOD_MS);
	}
}

void cb_device_start()
{
	uint8_t sta_mac[MWIFI_ADDR_LEN] = {0};
	esp_wifi_get_mac(ESP_IF_WIFI_STA, sta_mac);
	ESP_LOGI(TAG, "Mac: %02x:%02x:%02x:%02x:%02x:%02x", MAC2STR(sta_mac));

	xTaskCreate(cb_test, "cb_test", configMINIMAL_STACK_SIZE * 3, NULL, 5, NULL);
}

void app_main()
{
	char *device_map = "{ \"sensors\": [{ \"type\": \"bool\" }] }";
	if(!MODE_NO_NET)
	{
		start_device(device_map, &cb_device_start);
	}
	else
	{
		ws2812_control_init();
		struct led_state new_state;
		new_state.leds[0] = RED;
		new_state.leds[1] = GREEN;
		new_state.leds[2] = BLUE;

		ws2812_write_leds(new_state);
	}
}
