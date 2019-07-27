``` 
SELECT TIMESTAMP_TRUNC(usage_start_time, day) as usage_date,
  sku.description,
  usage.unit,
  sum(usage.amount) as egress_volume
FROM `BILLING_EXPORT_TABLE`
WHERE
  _PARTITIONTIME >= TIMESTAMP("2019-01-01")
  AND service.description = "Cloud Pub/Sub"
  AND (sku.description like "Internet data%"
      OR sku.description like "Inter-region data%")
GROUP BY usage_date, sku.description, usage.unit;
``` 