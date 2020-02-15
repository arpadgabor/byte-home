#include <stdio.h>
#include <stdint.h>
#include <stddef.h>
#include <string.h>
#include "esp_system.h"
#include "nvs_flash.h"
#include "esp_event.h"
#include "esp_netif.h"

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/semphr.h"
#include "freertos/queue.h"

#include "lwip/sockets.h"
#include "lwip/dns.h"
#include "lwip/netdb.h"

#include "esp_log.h"
#include "mqtt_client.h"
#include "config/config.h"
// #include "led-service.h"

static const char *MQTT_TAG = "MQTT";

static esp_err_t mqtt_event_handler_cb(esp_mqtt_event_handle_t event)
{
	esp_mqtt_client_handle_t client = event->client;

	switch (event->event_id) {
		case MQTT_EVENT_CONNECTED:
			ESP_LOGI(MQTT_TAG, "CONNECTED");
			esp_mqtt_client_subscribe(client, "test/helpme", 0);
			// msg_id = esp_mqtt_client_publish(client, "/topic/qos1", "data_3", 0, 1, 0);
			break;

		case MQTT_EVENT_DISCONNECTED:
			ESP_LOGI(MQTT_TAG, "DISCONNECTED");
			break;

		case MQTT_EVENT_SUBSCRIBED:
			ESP_LOGI(MQTT_TAG, "SUBSCRIBED, msg_id=%d", event->msg_id);
			break;

		case MQTT_EVENT_UNSUBSCRIBED:
			ESP_LOGI(MQTT_TAG, "UNSUBSCRIBED, msg_id=%d", event->msg_id);
			break;

		case MQTT_EVENT_PUBLISHED:
			ESP_LOGI(MQTT_TAG, "PUBLISHED, msg_id=%d", event->msg_id);
			break;

		case MQTT_EVENT_DATA:
			ESP_LOGI(MQTT_TAG, "RECIEVED");
			led_msg_len_blink(event->data_len);
			printf("TOPIC=%.*s\r\n", event->topic_len, event->topic);
			printf("DATA=%.*s\r\n", event->data_len, event->data);
			break;

		case MQTT_EVENT_ERROR:
			ESP_LOGI(MQTT_TAG, "ERROR");
			break;

		default:
			ESP_LOGI(MQTT_TAG, "Other event id:%d", event->event_id);
			break;
	}
	return ESP_OK;
}

static void mqtt_event_handler(void *handler_args, esp_event_base_t base, int32_t event_id, void *event_data) {
	ESP_LOGD(MQTT_TAG, "Event dispatched from event loop base=%s, event_id=%d", base, event_id);
	mqtt_event_handler_cb(event_data);
}

static void mqtt_app_start(void)
{
	esp_mqtt_client_config_t mqtt_cfg = {
		.uri = MQTT_URI,
	};

	esp_mqtt_client_handle_t client = esp_mqtt_client_init(&mqtt_cfg);
	esp_mqtt_client_register_event(client, ESP_EVENT_ANY_ID, mqtt_event_handler, client);
	esp_mqtt_client_start(client);
}