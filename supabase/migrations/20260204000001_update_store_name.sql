-- Update existing shipping_rates to use docimdagringa as store_name
UPDATE public.shipping_rates 
SET store_name = 'docimdagringa' 
WHERE store_name = 'Trezentos';
