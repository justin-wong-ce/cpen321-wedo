package com.example.cpen321_wedo.adapter;

import java.util.List;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.CheckBox;
import android.widget.ImageView;
import android.widget.TextView;

import com.example.cpen321_wedo.GenerateRouteActivity;
import com.example.cpen321_wedo.R;
import com.example.cpen321_wedo.getSelected;
import com.example.cpen321_wedo.models.Task;

import org.json.JSONException;

public class GenerateTaskAdapter extends BaseAdapter {

    private List<Task> mData;
    private LayoutInflater mInflater;
    getSelected getSelectedInterface;

    public GenerateTaskAdapter(List<Task> list, LayoutInflater inflater, getSelected getSelectedInterface) {
        mData = list;
        mInflater = inflater;
        this.getSelectedInterface = getSelectedInterface;
    }

    @Override
    public int getCount() {
        return mData.size();
    }

    @Override
    public Object getItem(int position) {
        return mData.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        final ViewItem item;

        if (convertView == null) {
            convertView = mInflater.inflate(R.layout.generate_route_task_item,
                    null);
            item = new ViewItem();

            item.task_name = (TextView) convertView
                    .findViewById(R.id.task_name);

            item.task_address = (TextView) convertView.findViewById(R.id.task_address);

            item.task_checkbox = (CheckBox) convertView.findViewById(R.id.CheckBoxSelected);

            convertView.setTag(item);
        } else {
            item = (ViewItem) convertView.getTag();
        }

        Task curProduct = mData.get(position);

        item.task_name.setText(curProduct.getTaskName());
        item.task_address.setText(curProduct.getTaskLocation());

        item.task_checkbox.setChecked(false);

        item.task_checkbox.setOnClickListener(new View.OnClickListener(){

            @Override
            public void onClick(View v) {
                if(item.task_checkbox.isChecked()){
                    item.task_checkbox.setChecked(true);
                    Log.d("test", item.task_address.toString());
                    getSelectedInterface.onAdd(item.task_address.getText().toString());
                }else{
                    item.task_checkbox.setChecked(false);
                    try {
                        getSelectedInterface.onDelete(item.task_address.getText().toString());
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            }
        });


        return convertView;
    }


    private class ViewItem {
        TextView task_name;
        TextView task_address;
        CheckBox task_checkbox;
    }

}