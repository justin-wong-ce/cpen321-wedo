package com.example.cpen321_wedo.notifications;

import android.annotation.SuppressLint;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.core.app.NotificationCompat;

import com.example.cpen321_wedo.AcceptFriendsActivity;
import com.example.cpen321_wedo.AcceptTaskListActivity;
import com.example.cpen321_wedo.MessageActivity;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;



@SuppressLint("MissingFirebaseInstanceTokenRefresh")
public class MyFirebaseMessaging extends FirebaseMessagingService {

    @Override
    public void onMessageReceived(@NonNull RemoteMessage remoteMessage) {
        super.onMessageReceived(remoteMessage);

        Log.d("test", "message received");

        String sented = remoteMessage.getData().get("sented");

        FirebaseUser firebaseUser = FirebaseAuth.getInstance().getCurrentUser();

        if(firebaseUser != null) {
            assert sented != null;
            if (sented.equals(firebaseUser.getUid())) {

                if(remoteMessage.getData().get("type").equals("MESSAGE")){
                    sendNotification(remoteMessage, new Intent(this, MessageActivity.class));
                }else if(remoteMessage.getData().get("type").equals("ADDFRIEND")){
                    sendNotification(remoteMessage, new Intent(this, AcceptFriendsActivity.class));
                }else if(remoteMessage.getData().get("type").equals("WORKTOGETHER")){
                    sendNotification(remoteMessage, new Intent(this, AcceptTaskListActivity.class));
                }
            }
        }
    }


    private void sendNotification(RemoteMessage remoteMessage, Intent intent){
        String user = remoteMessage.getData().get("user");
        String icon = remoteMessage.getData().get("icon");
        String title = remoteMessage.getData().get("title");
        String body = remoteMessage.getData().get("body");

        Log.d("test", user+"  "+icon+"  "+title+"  "+body);

//        RemoteMessage.Notification notification = remoteMessage.getNotification();
        assert user != null;
        int j = Integer.parseInt(user.replaceAll("[\\D]", ""));
        Bundle bundle =new Bundle();
        bundle.putString("userid", user);
        intent.putExtras(bundle);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent pendingIntent = PendingIntent.getActivity(this, j, intent, PendingIntent.FLAG_ONE_SHOT);

//        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, "2")
//                .setSmallIcon(R.mipmap.ic_launcher)
//                .setContentTitle(title)
//                .setContentText(body)
//                .setPriority(NotificationCompat.PRIORITY_DEFAULT);

        Uri defaulSound = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
        assert icon != null;
        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, "1")
                .setSmallIcon(Integer.parseInt(icon))
                .setContentTitle(title)
                .setContentText(body)
                .setAutoCancel(true)
                .setSound(defaulSound)
                .setContentIntent(pendingIntent);

        //TODO: this is where I changed when doing notification
//        NotificationManagerCompat notificationManager = NotificationManagerCompat.from(this);
        NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        int i =0;
        if(j>0){
            i=j;
        }
        Log.d("test", "i is"+i);
        notificationManager.notify(i, builder.build());
        Log.d("test", "send notification in firebase messaging service");
    }
}
