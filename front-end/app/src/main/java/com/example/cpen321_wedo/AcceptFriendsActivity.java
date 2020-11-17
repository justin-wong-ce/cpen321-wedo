package com.example.cpen321_wedo;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.recyclerview.widget.RecyclerView;
import androidx.recyclerview.widget.StaggeredGridLayoutManager;

import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.example.cpen321_wedo.adapter.AcceptFriendRequestAdapter;
import com.example.cpen321_wedo.adapter.TaskListAdapter;
import com.example.cpen321_wedo.adapter.UserAdapter;
import com.example.cpen321_wedo.models.TaskList;
import com.example.cpen321_wedo.models.User;
import com.example.cpen321_wedo.singleton.RequestQueueSingleton;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

import org.json.JSONArray;
import org.json.JSONException;

import java.util.ArrayList;
import java.util.List;

public class AcceptFriendsActivity extends AppCompatActivity {

    private AcceptFriendRequestAdapter myAdapter;
    private List<User> ToAcceptList;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_accept_friends);

        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        getSupportActionBar().setTitle("Accept");

        ToAcceptList = new ArrayList<>();

        RecyclerView myrv = findViewById(R.id.recyclerview_view);
        myAdapter = new AcceptFriendRequestAdapter(this, ToAcceptList);
        myrv.setLayoutManager((new StaggeredGridLayoutManager(1, 1)));

        myrv.setAdapter(myAdapter);

        getData();
    }

    // Get Request For JSONObject
    public void getData(){
        final FirebaseUser firebaseUser = FirebaseAuth.getInstance().getCurrentUser();
        DatabaseReference reference = FirebaseDatabase.getInstance().getReference();

        reference.child("FriendRequest").child(firebaseUser.getUid()).addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshots) {
                ToAcceptList.clear();
                for(DataSnapshot snapshot: snapshots.getChildren()){

                    User user = snapshot.getValue(User.class);

                    assert firebaseUser != null;
                    assert user != null;
                    ToAcceptList.add(user);
                }

                myAdapter.notifyDataSetChanged();
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {

            }
        });

    }

}