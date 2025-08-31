const port = 8080
const db_name = "CDR_Visualizer"
const base_url = `http://localhost:${port}`
const private_key = "secret"
const ip2location_api_key = "E834DC9F0F96074FA6FDEA7618E5DEA3"

module.exports = {
    port: port,
    db_name: db_name,
    base_url: base_url,
    private_key: private_key,
    ip2location_api_key: ip2location_api_key
}
