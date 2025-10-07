## Setup

1. Clone the repository:
   ```
   git clone https://github.com/nmarkoski/bus-map.git
   ```

2. Obtain a EuroGPS session ID:
   * Inspect any API request on [info.skopska.mk](http://info.skopska.mk) (e.g., `http://info.skopska.mk:8080/rest-its/scheme/routes`).
   * Copy the value of the `eurogps.eu.sid` header.

3. Copy `.env.sample` to `.env` and replace `YOUR_SESSION_ID` with your session ID.

4. Start the app:
   ```
   docker compose up -d
   ```

The app should be available on port `8080`.
