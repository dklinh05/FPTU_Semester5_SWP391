package com.farm.farmtrade.service.geoLocation;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.json.JSONObject;

public class GeocodingService {
    private static final Map<String, String> mergedWardToOldDistrict = Map.ofEntries(
            Map.entry("Hải Châu", "Hải Châu"),
            Map.entry("Hòa Cường", "Hải Châu"),
            Map.entry("Thanh Khê", "Thanh Khê"),
            Map.entry("An Khê", "Thanh Khê"),
            Map.entry("An Hải", "Sơn Trà"),
            Map.entry("Sơn Trà", "Sơn Trà"),
            Map.entry("Ngũ Hành Sơn", "Ngũ Hành Sơn"),
            Map.entry("Điện Bàn Đông", "Ngũ Hành Sơn"),
            Map.entry("Hòa Khánh", "Liên Chiểu"),
            Map.entry("Hải Vân", "Liên Chiểu"),
            Map.entry("Liên Chiểu", "Liên Chiểu"),
            Map.entry("Cẩm Lệ", "Cẩm Lệ"),
            Map.entry("Hòa Xuân", "Cẩm Lệ")
    );


    public String getDistrictFromCoordinates(double lat, double lon) {
        try {
            String urlStr = String.format(
                    "https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=%f&lon=%f",
                    lat, lon);

            URL url = new URL(urlStr);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();

            conn.setRequestMethod("GET");
            conn.setRequestProperty("User-Agent", "Mozilla/5.0");
            conn.setRequestProperty("Accept", "application/json");

            if (conn.getResponseCode() != 200) {
                throw new RuntimeException("HTTP GET Request Failed: " + conn.getResponseCode());
            }

            BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            StringBuilder jsonText = new StringBuilder();
            String line;
            while ((line = br.readLine()) != null) {
                jsonText.append(line);
            }

            JSONObject json = new JSONObject(jsonText.toString());
            JSONObject address = json.getJSONObject("address");
            String rawWard = null;
            if (address.has("city_district")) {
                rawWard = address.getString("city_district");
            }

            if (address.has("suburb")) {
                rawWard = address.getString("suburb");
            } else if (address.has("neighbourhood")) {
                rawWard = address.getString("neighbourhood");
            }
            if (rawWard != null) {
                String cleanedWard = normalizeWardName(rawWard);

                // Nếu ánh xạ được thì trả về
                if (mergedWardToOldDistrict.containsKey(cleanedWard)) {
                    return mergedWardToOldDistrict.get(cleanedWard);
                }

                return "Không xác định quận";
            }


            return "Không xác định quận";
        } catch (Exception e) {
            e.printStackTrace();
            return "Lỗi khi gọi API";
        }
    }

    private String normalizeWardName(String raw) {
        // Loại bỏ các tiền tố không cần thiết như "Phường", "Quận", "P.", "Q.",...
        String cleaned = raw.replaceAll("(?i)^phường\\s*|^quận\\s*|^p\\.\\s*|^q\\.\\s*|^phuong\\s*|^quan\\s*", "")
                .trim();

        // Viết hoa chữ cái đầu mỗi từ
        return Arrays.stream(cleaned.split("\\s+"))
                .map(word -> word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase())
                .collect(Collectors.joining(" "));
    }

    private static final List<String> knownDistricts = List.of(
            "Hải Châu", "Thanh Khê", "Sơn Trà", "Ngũ Hành Sơn",
            "Liên Chiểu", "Cẩm Lệ", "Hòa Vang"
    );

}
