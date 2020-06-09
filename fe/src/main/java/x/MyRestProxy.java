package x;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.boot.jackson.JsonObjectDeserializer;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

/**
 * <p>Handle errors from Node.
 * </p>
 */

@RestController
public class MyRestProxy {
    private static final Logger LOGGER = LoggerFactory.getLogger(MyRestProxy.class);

    private DateTimeFormatter dateTimeFormatter;
    private final RestTemplate restTemplate;
    private final String mapName;
    private final String sender;
    
    public MyRestProxy() {
        this.dateTimeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss", Locale.ROOT);
        this.restTemplate = new RestTemplate();
        this.mapName = "chat-" + LocalDate.now();
        this.sender = System.getProperty("user.name", "?");
        
        LOGGER.info("{} -> creating a new map '{}'", this, mapName);
        
        /* console.log('main -> creating a new map', newMapName)
         * await httpClient.post('maps', { name: newMapName })
         */
        try {
            String url = Application.NODE_SERVER 
                    + "/maps";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> map= new LinkedMultiValueMap<String, String>();
            map.add("name", mapName);

            HttpEntity<MultiValueMap<String, String>> request = 
                    new HttpEntity<MultiValueMap<String, String>>(map, headers);

            LOGGER.info("URL {}", url);
            ResponseEntity<Object> response = restTemplate.postForEntity(url, request, Object.class);
            
            if (response.getStatusCode() != HttpStatus.CREATED) {
                LOGGER.error("{}", response);
            } else {
                LOGGER.debug("{}", response.getStatusCode());
            }

        } catch (Exception e) {
            LOGGER.error("MyRestProxy()", e);
        }
    } 
    
    @GetMapping(value = "/send", produces = MediaType.APPLICATION_JSON_VALUE)
    public String send(@RequestParam("message") String message) {
        LOGGER.info("message()");
        
        LocalTime localTime = LocalTime.now();
        
        String key = localTime.format(this.dateTimeFormatter) + "," + this.sender;
        String value = Rot13.encode(message);

        /* console.log('main -> inserting a key')
         * await httpClient.post(`maps/${newMapName}/luke`, { data: { jedi: 'test' } })
         */
        LOGGER.info("{} -> inserting a key '{}' value '{}'", this, key, value);
        try {
            String url = Application.NODE_SERVER 
                    + "/maps/" + this.mapName + "/" + key;
            LOGGER.info("URL {}", url);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            MultiValueMap<String, String> map= new LinkedMultiValueMap<String, String>();
            
            value = value.replaceAll("\"", "'");
            JSONObject dataJSON = new JSONObject("{ \"data\": \"" + value + "\" }");
            LOGGER.info("{}", dataJSON);
            
            map.add("data", dataJSON.toString());

            HttpEntity<MultiValueMap<String, String>> request = 
                    new HttpEntity<MultiValueMap<String, String>>(map, headers);

            ResponseEntity<Object> response = restTemplate.postForEntity(url, request, Object.class);
            
            if (response.getStatusCode() != HttpStatus.OK) {
                LOGGER.error("{}", response);
                LOGGER.error("{}", response.getBody());
                LOGGER.error("{}", response.getStatusCode());
            } else {
                LOGGER.debug("{}", response);
                LOGGER.debug("{}", response.getBody());
                LOGGER.debug("{}", response.getStatusCode());
            }

            String responseStr = "{ \"success\": true }";
            LOGGER.info(responseStr);
            return responseStr;
            
        } catch (Exception e) {
            LOGGER.error(String.format("send('%s')", message), e);
            String text = e.getMessage().replaceAll("\"", "'");
            String response = "{ \"success\": false, \"error\": \"" + text+ "\"}";
            LOGGER.info(response);
            return response;
        }

    }
}
