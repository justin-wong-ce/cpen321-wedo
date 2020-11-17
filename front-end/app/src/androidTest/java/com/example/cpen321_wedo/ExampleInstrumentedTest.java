package com.example.cpen321_wedo;

import android.content.Context;

import androidx.test.ext.junit.rules.ActivityScenarioRule;
import androidx.test.platform.app.InstrumentationRegistry;
import androidx.test.ext.junit.runners.AndroidJUnit4;

import org.junit.Assert;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.action.ViewActions.typeText;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static androidx.test.espresso.matcher.ViewMatchers.withText;
import static org.junit.Assert.assertEquals;

/**
 * Instrumented test, which will execute on an Android device.
 *
 * @see <a href="http://d.android.com/tools/testing">Testing documentation</a>
 */
@RunWith(AndroidJUnit4.class)
public class ExampleInstrumentedTest {

    @Rule
    public ActivityScenarioRule<StartActivity> activityRule =
            new ActivityScenarioRule<>(StartActivity.class);

    @Test
    public void useAppContext() {
        // Context of the app under test.
        Context appContext = InstrumentationRegistry.getInstrumentation().getTargetContext();
        assertEquals("com.wedo.wedoapp", appContext.getPackageName());
    }

    @Test
    public void checkLoginButton() {
        onView(withId(R.id.login)).perform(click());
        onView(withId(R.id.loginActivityLayout)).check(matches(isDisplayed()));
        onView(withId(R.id.email)).perform(typeText("test1@gmail.com"));
        onView(withId(R.id.password)).perform(typeText("123456789"));
        onView(withId(R.id.email)).check(matches(withText("test1@gmail.com")));
        Assert.assertTrue(true);
    }


}