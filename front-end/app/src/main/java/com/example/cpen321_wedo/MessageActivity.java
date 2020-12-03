package com.example.cpen321_wedo;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.widget.Toolbar;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.cpen321_wedo.adapter.MessageAdapter;
import com.example.cpen321_wedo.models.Chat;
import com.example.cpen321_wedo.models.User;
import com.example.cpen321_wedo.notifications.APIService;
import com.example.cpen321_wedo.notifications.MyClientUtil;
import com.example.cpen321_wedo.notifications.Data;
import com.example.cpen321_wedo.notifications.MyResponse;
import com.example.cpen321_wedo.notifications.Sender;
import com.example.cpen321_wedo.notifications.Token;
import com.example.cpen321_wedo.notifications.NotificationType;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.Query;
import com.google.firebase.database.ValueEventListener;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import de.hdodenhof.circleimageview.CircleImageView;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MessageActivity extends AppCompatActivity {

    private CircleImageView profile_image;
    private TextView username;
    private FirebaseUser firebaseUser;
    private DatabaseReference reference;

    private EditText text_send;

    private MessageAdapter messageAdapter;
    private List<Chat> mchat;

    private RecyclerView recyclerView;

    private String userid;

    private APIService apiService;

    private boolean notify = false;

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_message);

//        Toolbar toolbar = findViewById(R.id.toolbar);
//        setSupportActionBar(toolbar);
//        getSupportActionBar().setTitle("");
//        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
//
//        toolbar.setNavigationOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View v) {
//                finish();
//            }
//        });

        profile_image = findViewById(R.id.profile_image);
        username = findViewById(R.id.username);
        Intent intent = getIntent();
        userid = intent.getStringExtra("userid");
        final boolean isGroupChat = intent.getExtras().getBoolean("isGroupChat");
        ImageButton btn_send = findViewById(R.id.btn_send);
        text_send = findViewById(R.id.text_send);
        apiService = MyClientUtil.getClient("https://fcm.googleapis.com/").create(APIService.class);

        recyclerView = findViewById(R.id.recyclerview_view);
        recyclerView.setHasFixedSize(true);
        LinearLayoutManager linearLayoutManager = new LinearLayoutManager(getApplicationContext());
        linearLayoutManager.setStackFromEnd(true);
        recyclerView.setLayoutManager(linearLayoutManager);

        firebaseUser = FirebaseAuth.getInstance().getCurrentUser();
        reference = FirebaseDatabase.getInstance().getReference("Users").child(userid);

        btn_send.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                notify = true;
                String msg = text_send.getText().toString();
                if(!msg.equals("")){
                    if(isGroupChat){
                        sendMessageToGroup(firebaseUser.getUid(), userid, msg);
                    }else{
                        sendMessageToUser(firebaseUser.getUid(), userid, msg);
                    }
                }else{
                    Toast.makeText(MessageActivity.this, "You cannot send empty message", Toast.LENGTH_SHORT).show();
                }

                text_send.setText("");
            }
        });


        reference.addValueEventListener(new ValueEventListener() {
            @SuppressLint("SetTextI18n")
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {

                if(isGroupChat){
                    username.setText("Group Chat");
                    readMessageInGroupChat(userid);
                }else{
                    User user = snapshot.getValue(User.class);
                    assert user != null;
                    username.setText(user.getUsername());
                    if(user.getImageURL().equals("default")){
                        profile_image.setImageResource(R.mipmap.ic_launcher);
                    }else{
                        Glide.with(MessageActivity.this).load(user.getImageURL()).into(profile_image);
                    }
                    readMessageOfPrivateChat(firebaseUser.getUid(), userid, user.getImageURL());
                }
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {
                // Just print the error for now
                Log.d("test", error.toString());
            }
        });
    }

    public void setSupportActionBar(Toolbar toolbar) {
        Log.d("test", "This should be implemented later");
    }

    private void sendMessageToUser(final String sender, final String receiver, String message){
        DatabaseReference reference = FirebaseDatabase.getInstance().getReference();

        HashMap<String, Object> hashMap = new HashMap<>();
        hashMap.put("sender", sender);
        hashMap.put("receiver", receiver);
        hashMap.put("message", message);

        reference.child("privateChats").push().setValue(hashMap);

        final String msg = message;
        reference = FirebaseDatabase.getInstance().getReference("Users").child(firebaseUser.getUid());
        reference.addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                User user = snapshot.getValue(User.class);
                if(notify){
                    assert user != null;
                    sendNotifications(receiver, user.getUsername(), msg);
                }

                notify = false;
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {
                Log.d("test", error.toString());
            }
        });

    }

    private void sendNotifications(final String receiver, final String username, final String message){
        DatabaseReference tokens = FirebaseDatabase.getInstance().getReference("Tokens");
        Query query = tokens.orderByKey().equalTo(receiver);
        query.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshots) {
                for(DataSnapshot snapshot: snapshots.getChildren()){
                    Token token = snapshot.getValue(Token.class);
                    assert token != null;
                    Log.d("test", token.getToken());
                    Data data = new Data(firebaseUser.getUid(), R.mipmap.ic_launcher, username+": "+message, "New Message", userid, NotificationType.MESSAGE);
                    Sender sender = new Sender(data, token.getToken());

                    apiService.sendNotification(sender)
                            .enqueue(new Callback<MyResponse>() {
                                @Override
                                public void onResponse(Call<MyResponse> call, Response<MyResponse> response) {
                                    if(response.code() == 200) {
                                        assert response.body() != null;
                                        if (response.body().success==1) {

                                            Toast.makeText(MessageActivity.this, "Failed", Toast.LENGTH_SHORT).show();

                                        }
                                    }
                                }

                                @Override
                                public void onFailure(Call<MyResponse> call, Throwable t) {
                                    Log.d("test", "cannot send notification, there is an error");
                                }
                            });
                }
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {
                Log.d("test", error.toString());
            }
        });
    }

    private void readMessageOfPrivateChat(final String myid, final String userid, final String imageurl){
        mchat = new ArrayList<>();
        reference = FirebaseDatabase.getInstance().getReference("privateChats");
        reference.addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshots) {
                mchat.clear();
                for(DataSnapshot snapshot: snapshots.getChildren()){
                    Chat chat = snapshot.getValue(Chat.class);
                    assert chat != null;
                    if(chat.getReceiver().equals(myid) && chat.getSender().equals(userid) ||
                            chat.getReceiver().equals(userid) && chat.getSender().equals(myid)){
                        mchat.add(chat);
                    }

                    messageAdapter = new MessageAdapter(MessageActivity.this, mchat, imageurl, false);
                    recyclerView.setAdapter(messageAdapter);
                }
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {
                Log.d("test", error.toString());
            }
        });
    }

    private void sendMessageToGroup(String sender, String taskListID, String message){
        DatabaseReference reference = FirebaseDatabase.getInstance().getReference();
        HashMap<String, Object> hashMap = new HashMap<>();
        hashMap.put("sender", sender);
        hashMap.put("message", message);

        reference.child("groupChats").child(taskListID).child("messages").push().setValue(hashMap);
    }

    private void readMessageInGroupChat(final String taskListID){
        mchat = new ArrayList<>();
        // TODO: I use "111" for now, don't forget to change it back later.
        reference = FirebaseDatabase.getInstance().getReference("groupChats").child(taskListID).child("messages");
        reference.addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshots) {
                mchat.clear();
                for(DataSnapshot snapshot: snapshots.getChildren()){
                    Chat chat = snapshot.getValue(Chat.class);
                    mchat.add(chat);

                    messageAdapter = new MessageAdapter(MessageActivity.this, mchat, "default", true);
                    recyclerView.setAdapter(messageAdapter);

//                    // TODO: for the image url I'll let it be default for a moment
//                    Query query = FirebaseDatabase.getInstance().getReference("Users").equalTo(chat.getSender(), "id");
//                    query.addListenerForSingleValueEvent(new ValueEventListener() {
//                        @Override
//                        public void onDataChange(DataSnapshot dataSnapshot) {
//
//                            if (dataSnapshot.exists()) {
//                                for (DataSnapshot issue : dataSnapshot.getChildren()) {
//                                    User user = issue.getValue(User.class);
//                                    messageAdapter = new MessageAdapter(MessageActivity.this, mchat, user.getImageURL());
//                                    recyclerView.setAdapter(messageAdapter);
//                                }
//                            }
//                        }
//
//                        @Override
//                        public void onCancelled(DatabaseError databaseError) {
//                            Log.d("test", databaseError.toString());
//                        }
//                    });
                }
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {
                Log.d("test", error.toString());
            }
        });
    }
}