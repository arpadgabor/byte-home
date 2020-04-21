# ByteHome API

## To run

1. Clone the repo
2. `npm install`
3. `npm i -g npx`
5. `npm start`

---

Some queries:

```sql
SELECT sensors.type, date_trunc('minute', time) as minute, AVG(value)
FROM readings
JOIN sensors ON readings.sensor = sensors.id
GROUP BY sensors.type, minute
ORDER BY sensors.type, minute desc;


SELECT 
sensors.type, date_trunc('hour', time) as hour, AVG(value), MIN(value), MAX(value)
FROM readings
JOIN sensors ON readings.sensor = sensors.id
GROUP BY sensors.type, hour
ORDER BY sensors.type, hour desc;
```