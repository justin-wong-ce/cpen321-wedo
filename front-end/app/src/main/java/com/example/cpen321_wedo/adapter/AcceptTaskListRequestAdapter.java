package com.example.cpen321_wedo.adapter;

import android.content.Context;
import android.graphics.Color;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.example.cpen321_wedo.GoBackInterface;
import com.example.cpen321_wedo.R;
import com.example.cpen321_wedo.models.TaskListRequest;
import com.example.cpen321_wedo.singleton.RequestQueueSingleton;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.FirebaseDatabase;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;
import java.util.Random;

public class AcceptTaskListRequestAdapter extends RecyclerView.Adapter<AcceptTaskListRequestAdapter.MyViewHolder>{

    private Context mContext;
    private final List<TaskListRequest> mData;
    private final FirebaseUser firebaseUser;
    private GoBackInterface goBackInterface;

    public AcceptTaskListRequestAdapter(Context mContext, List<TaskListRequest> mData, GoBackInterface goBackInterface){
        this.mContext = mContext;
        this.mData = mData;
        firebaseUser = FirebaseAuth.getInstance().getCurrentUser();
        this.goBackInterface = goBackInterface;
    }

    @NonNull
    @Override
    public AcceptTaskListRequestAdapter.MyViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view;
        LayoutInflater mInflater = LayoutInflater.from(mContext);
        view = mInflater.inflate(R.layout.accept_tasklists_request_item, parent, false);

        return new AcceptTaskListRequestAdapter.MyViewHolder(view);
    }


    @Override
    public void onBindViewHolder(@NonNull final AcceptTaskListRequestAdapter.MyViewHolder holder, final int position) {
        final TaskListRequest taskListRequest = mData.get(position);

        holder.title.setText(taskListRequest.getUsername()+" invites you to work on taskList "+taskListRequest.getTasklistName());
        holder.body.setText("Description: "+taskListRequest.getTasklistDescription());

        Random rnd = new Random();
        int color = Color.argb(255, rnd.nextInt(256), rnd.nextInt(256), rnd.nextInt(256));
        holder.colorView.setBackgroundColor(color);

        holder.btn_decline.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                FirebaseDatabase.getInstance().getReference().child("TaskListRequest").child(firebaseUser.getUid()).child(taskListRequest.getId()).removeValue();
                goBackInterface.goBack();
            }
        });

        holder.btn_accept.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                try {
                    userCanAccessTasklistBackend(mData.get(position).getOwnerID(), taskListRequest.getId());
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                FirebaseDatabase.getInstance().getReference().child("TaskListRequest").child(firebaseUser.getUid()).child(taskListRequest.getId()).removeValue();

            }
        });

    }

    public void userCanAccessTasklistBackend(String userID, String tasklistID) throws JSONException {

        String url = "http://40.78.89.252:3000/tasklist/adduser";
        JSONObject object = new JSONObject();
        object.put("userID", userID);
        object.put("taskListID", tasklistID);
        object.put("addUser", firebaseUser.getUid());

        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, url, object,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                            goBackInterface.goBack();
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Log.d("testing", error.toString());
                    }
        });

        RequestQueueSingleton.getInstance(mContext).addToRequestQueue(jsonObjectRequest);
    }


    @Override
    public int getItemCount() {
        return mData.size();
    }

    public static class MyViewHolder extends RecyclerView.ViewHolder {

        public TextView title;
        public TextView body;
        public Button btn_decline;
        public Button btn_accept;
        public View colorView;

        public MyViewHolder(View itemView) {
            super(itemView);

            title = itemView.findViewById(R.id.tasklist_request_title);
            body = itemView.findViewById(R.id.tasklist_request_description);
            btn_decline = itemView.findViewById(R.id.btn_decline);
            btn_accept = itemView.findViewById(R.id.btn_accept);
            colorView = itemView.findViewById(R.id.color_view);
        }
    }
}
