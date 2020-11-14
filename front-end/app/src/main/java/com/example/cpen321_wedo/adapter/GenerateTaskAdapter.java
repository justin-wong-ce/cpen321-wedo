package com.example.cpen321_wedo.adapter;

import java.util.List;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.CheckBox;
import android.widget.ImageView;
import android.widget.TextView;

import com.example.cpen321_wedo.R;
import com.example.cpen321_wedo.models.Task;

public class GenerateTaskAdapter extends BaseAdapter {

    private List<Task> mData;
    private LayoutInflater mInflater;

    public GenerateTaskAdapter(List<Task> list, LayoutInflater inflater) {
        mData = list;
        mInflater = inflater;
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
                    }else{
                    item.task_checkbox.setChecked(false);
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