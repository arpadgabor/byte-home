#include "driver/gpio.h"

#define STATUS_LED 5

void set_status_led(int level)
{
	char *status = (level == 0 ? "ON" : "OFF");
	printf("STATUS LED: %s", status);
	gpio_set_level(STATUS_LED, level);
}

void blink_led(int interval)
{
	set_status_led(0);
	vTaskDelay(interval / portTICK_PERIOD_MS);
	set_status_led(1);
	vTaskDelay(interval / portTICK_PERIOD_MS);
}

void led_msg_len_blink(int len)
{
	int i;
	for(i = 0; i < len; i++)
	{
		blink_led(100);
	}
}

void init_status_led()
{
	gpio_pad_select_gpio(STATUS_LED);
	gpio_set_direction(STATUS_LED, GPIO_MODE_OUTPUT);
	set_status_led(1);
}