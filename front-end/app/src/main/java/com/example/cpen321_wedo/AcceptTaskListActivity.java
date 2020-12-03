package com.example.cpen321_wedo;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.recyclerview.widget.RecyclerView;
import androidx.recyclerview.widget.StaggeredGridLayoutManager;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.example.cpen321_wedo.adapter.AcceptTaskListRequestAdapter;
import com.example.cpen321_wedo.models.TaskListRequest;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

import java.util.ArrayList;
import java.util.List;

public class AcceptTaskListActivity extends AppCompatActivity implements GoBackInterface {

    private AcceptTaskListRequestAdapter myAdapter;
    private List<TaskListRequest> ToAcceptList;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_accept_task_list);

        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        getSupportActionBar().setTitle("Accept");

        ToAcceptList = new ArrayList<>();

        RecyclerView myrv = findViewById(R.id.recyclerview_view);
        myAdapter = new AcceptTaskListRequestAdapter(this, ToAcceptList, this);
        myrv.setLayoutManager((new StaggeredGridLayoutManager(1, 1)));

        myrv.setAdapter(myAdapter);

        getData();
    }

    // Get Request For JSONObject
    public void getData(){
        final FirebaseUser firebaseUser = FirebaseAuth.getInstance().getCurrentUser();
        DatabaseReference reference = FirebaseDatabase.getInstance().getReference();

        reference.child("TaskListRequest").child(firebaseUser.getUid()).addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshots) {
                ToAcceptList.clear();
                for(DataSnapshot snapshot: snapshots.getChildren()){

                    TaskListRequest taskListRequest = snapshot.getValue(TaskListRequest.class);

                    assert firebaseUser != null;
                    assert taskListRequest != null;
                    ToAcceptList.add(taskListRequest);
                }

                myAdapter.notifyDataSetChanged();
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {
                Log.d("test", "user has cancelled");
            }
        });

    }

    @Override
    public void goBack() {
        Intent intent=new Intent();
        setResult(3,intent);
        finish();
    }
}