SELECT
  IFNULL(project.id, "No Project") AS porject_id,
  IFNULL(service.description, "No Service Description") AS service_description,
  IFNULL(sku.description, "No SKU Description") AS sku_desciption,
  IFNULL(invoice.month, "No Invoice Month") AS invoice_month,
  IFNULL(CASE
      WHEN usage.unit = "bytes" THEN "GB"
      WHEN usage.unit = "seconds" THEN "Hrs"
      WHEN usage.unit = "byte-seconds" THEN "GB-Month"
  END, "No Usage Unit")AS usage_unit,
  IFNULL(location.location, "No Location") AS location_location,
  SUM(IFNULL(CASE
        WHEN usage.unit = "bytes" THEN IFNULL(usage.amount, 0)/1073741824
        WHEN usage.unit = "seconds" THEN IFNULL(usage.amount, 0)/3600
        WHEN usage.unit = "byte-seconds" THEN IFNULL(usage.amount, 0)/720000576000000
      ELSE IFNULL(usage.amount,0)
    END, 0)) AS usage_amount,
  SUM(IFNULL(usage.amount_in_pricing_units, 0)) AS usage_amount_in_pricing_units,
  _PARTITIONTIME AS export_time, SUM(IFNULL(cost, 0)) AS cost,
  SUM(IFNULL(( SELECT SUM(c.amount) FROM UNNEST(credits) c), 0)) AS credits,
  SUM(IFNULL(cost, 0)) + SUM(IFNULL(( SELECT SUM(c.amount) FROM UNNEST(credits) c), 0)) AS final_cost
FROM
  `<PROJECT_ID>.<SCHEMA_ID>.gcp_billing_export_v1_<BILLING_ID>`
GROUP BY
  project.id,
  service.description,
  sku.description,
  invoice.month,
  usage.unit,
  location.country,
  location.location,
  _PARTITIONTIME