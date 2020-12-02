package com.example.cpen321_wedo.adapter;
import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.PopupMenu;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.example.cpen321_wedo.AddTaskListActivity;
import com.example.cpen321_wedo.AddUserActivity;
import com.example.cpen321_wedo.R;
import com.example.cpen321_wedo.TaskActivity;
import com.example.cpen321_wedo.models.TaskList;
import com.example.cpen321_wedo.singleton.RequestQueueSingleton;
import com.example.cpen321_wedo.UpdateTasklistInterface;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

import org.json.JSONObject;

import java.util.List;
import java.util.Random;

public class TaskListAdapter extends RecyclerView.Adapter<TaskListAdapter.MyViewHolder> {

    private final Context mContext;
    private final List<TaskList> mData;
    private UpdateTasklistInterface updateTasklistInterface;

    public TaskListAdapter(Context mContext, List<TaskList> mData, UpdateTasklistInterface updateTasklistInterface){
        this.mContext = mContext;
        this.mData = mData;
        this.updateTasklistInterface = updateTasklistInterface;
    }

    @NonNull
    @Override
    public MyViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view;
        LayoutInflater mInflater = LayoutInflater.from(mContext);
        view = mInflater.inflate(R.layout.task_list_view_item, parent, false);

        return new MyViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull final MyViewHolder holder, final int position) {
        holder.tv_tasklist.setText(mData.get(position).getTaskListName());
        holder.tv_taskDescription.setText(mData.get(position).getDescription());
        // if you want image here:
        //holder.img_tasklist_thumbnail.setImageResource(mData.get(position).getThumbnail());
        Random rnd = new Random();
        int color = Color.argb(255, rnd.nextInt(256), rnd.nextInt(256), rnd.nextInt(256));
        holder.colorView.setBackgroundColor(color);

        holder.cardView.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View v){
                Intent intent = new Intent(mContext, TaskActivity.class);
                intent.putExtra("taskListId", mData.get(position).getTaskListID());
                mContext.startActivity(intent);

            }
        });

        holder.menuView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                //creating a popup menu
                PopupMenu popup = new PopupMenu(mContext, holder.menuView);
                //inflating menu from xml resource
                popup.inflate(R.menu.tasklist_options_memu);
                //adding click listener
                popup.setOnMenuItemClickListener(new PopupMenu.OnMenuItemClickListener() {
                    @SuppressLint("NonConstantResourceId")
                    @Override
                    public boolean onMenuItemClick(MenuItem item) {
                        switch (item.getItemId()) {
                            case R.id.menu1:
                                Intent intent = new Intent(mContext, AddUserActivity.class);
                                intent.putExtra("Friends", false);
                                intent.putExtra("tasklistName", mData.get(position).getTaskListName());
                                intent.putExtra("tasklistDescription", mData.get(position).getDescription());
                                intent.putExtra("tasklistID", mData.get(position).getTaskListID());
                                mContext.startActivity(intent);
                                break;
                            case R.id.menu2:
                                delteTasklist(position);
                                mData.remove(position);
                                notifyItemRemoved(position);
                                notifyItemRangeChanged(position, mData.size());
                                break;
                            case R.id.menu3:
                                updateTasklistInterface.helper(mData.get(position).getTaskListID());
                                break;
                            default:
                                break;
                        }
                        return false;
                    }
                });
                //displaying the popup
                popup.show();

            }
        });

    }

    public void delteTasklist(final int index){
        FirebaseUser firebaseUser = FirebaseAuth.getInstance().getCurrentUser();

        try {
            String url = "http://40.78.89.252:3000/tasklist/delete/";

            url+="\""+firebaseUser.getUid()+"\"/";
            url+="\""+mData.get(index).getTaskListID()+"\"";

            Log.d("test", url);

            JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.DELETE, url, null,
                    new Response.Listener<JSONObject>() {
                        @Override
                        public void onResponse(JSONObject response) {
//                            mData.remove(index);
                        }
                    }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    Toast.makeText(mContext, "error deleting tasklist", Toast.LENGTH_LONG).show();
                    Log.d("test", error.toString());
                }
            });

            RequestQueueSingleton.getInstance(mContext).addToRequestQueue(jsonObjectRequest);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public int getItemCount() {
        Log.d("test", mData.size()+"");
        return mData.size();
    }

    public static class MyViewHolder extends RecyclerView.ViewHolder {

        private final TextView tv_tasklist;
//        ImageView img_tasklist_thumbnail;
        private final View cardView;
        private final View colorView;
        private final View menuView;
        private final TextView tv_taskDescription;

        public MyViewHolder(View itemView) {
            super(itemView);

            tv_tasklist = itemView.findViewById(R.id.tasklist_title_id);
            tv_taskDescription = itemView.findViewById(R.id.tasklist_description);
            //img_tasklist_thumbnail = (ImageView) itemView.findViewById(R.id.tasklist_image_id);
            cardView = itemView.findViewById(R.id.cardview_id);
            colorView = itemView.findViewById(R.id.color_view);
            menuView = itemView.findViewById(R.id.memu_options);

        }
    }
}
