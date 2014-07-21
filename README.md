geocoder
========
[lib/geo.js](./lib/geo.js) is a simple library for geocoding based on [Google geocoding API](https://developers.google.com/maps/documentation/geocoding/). It helps to distinguish a rooftop geocode result from others. 

[geocodecsv.js](./geocodecsv.js) is a script to read addresses from a csv file and get the corresponding rooftop geocodes. Since Google geocoding API has [quota limits](https://developers.google.com/maps/articles/geocodestrat#quota-limits), especially a [10 requests per second rate limit](https://developers.google.com/maps/documentation/geocoding/#Limits). In my testing, the rate limit is lower than that as observed from the client side. Google suggests a [pause-and-retry approach](https://developers.google.com/maps/documentation/business/articles/usage_limits#limitexceeded) for this. I implement both a rate limiter and a pause-and-retry in the script. [example/test.csv](./example/test.csv) is a csv file for testing the script. A request rate of one per second is always safe to the usage limit, and this is implemented in the [limiter branch](https://github.com/dongliu/geocoder/tree/limiter) branch. However, such an approach is slow for a long address list.
 