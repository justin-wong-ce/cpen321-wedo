package com.example.cpen321_wedo.Notifications;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.Header;
import retrofit2.http.Headers;
import retrofit2.http.POST;

public interface APIService {
    @Headers(
            {
                    "Content-Type:application/json",
                    "Authorization:key=AAAAPyRaBiY:APA91bE7n8a-pO8C_CD-P3wZ4u2PLCLHEkIKtp7YgN7KNUW1yU9FKYfhRFMyo5Wl7mKcbsIn617VL1aFp3tNCLCTe2fS514IgDyV7GpOZJdMXWOngDZs-Gft5odHXMr2GN1tvsHzPAmO"
            }
    )

    @POST("fcm/send")
    Call<MyResponse> sendNotification(@Body Sender body);
}
