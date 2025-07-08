## Setup

1. Clone the repository:
   ```
   git clone https://github.com/nmarkoski/bus-map.git
   ```

2. Obtain a [Google Maps API key](https://developers.google.com/maps/documentation/javascript/get-api-key) and a [Map ID](https://developers.google.com/maps/documentation/javascript/map-ids/get-map-id).

3. Replace placeholders:
   * In `/public/index.html`, replace `YOUR_API_KEY` with your API key.
   * In `/public/src/constants.js`, replace `YOUR_MAP_ID` with your Map ID.

4. Obtain a EuroGPS session ID:
   * Inspect any API request on [info.skopska.mk](http://info.skopska.mk) (e.g., `http://info.skopska.mk:8080/rest-its/scheme/routes`).
   * Copy the value of the `eurogps.eu.sid` header.

5. Copy `.env.sample` to `.env` and replace `YOUR_SESSION_ID` with your session ID.

6. Start the project:
   ```
   docker compose up -d
   ```

The app should be available on port `8080`.
