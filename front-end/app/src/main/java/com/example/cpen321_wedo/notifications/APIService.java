package com.example.cpen321_wedo.notifications;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.Headers;
import retrofit2.http.POST;

public interface APIService {
    @Headers(
            {
                    "Content-Type:application/json",
                    "Authorization: key=AAAAGBByOa0:APA91bHVkzP4NZQm85YqF9tqFI2NfEkOr506Qw1SfhuWkfakIqM4Gtphbsm4NamnYqROFyrK_ceihYP3aEQTWYIzKBUc1ny7pDkjXRAFVXj1M02rFJagABqsyvkJcUXeXQLh2x7_Ascs"
            }
    )

    @POST("fcm/send")
    Call<MyResponse> sendNotification(@Body Sender body);
}
