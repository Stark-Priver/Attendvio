/**
 * Root Navigation
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import { Loading } from '../components';
import { Colors } from '../theme';

// Auth screens
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';

// Teacher screens
import TeacherDashboardScreen from '../screens/Teacher/TeacherDashboardScreen';

// Student screens
import StudentDashboardScreen from '../screens/Student/StudentDashboardScreen';
import MarkAttendanceScreen from '../screens/Student/MarkAttendanceScreen';

const Stack = createStackNavigator();

const RootNavigator: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loading message="Loading..." />;
  }

  return (
    <NavigationContainer>
      {!user ? (
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: Colors.primary },
            headerTintColor: Colors.white,
            headerTitleStyle: { fontWeight: '600' },
          }}
        >
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ title: 'Create Account' }}
          />
        </Stack.Navigator>
      ) : user.role === 'TEACHER' ? (
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: Colors.primary },
            headerTintColor: Colors.white,
            headerTitleStyle: { fontWeight: '600' },
          }}
        >
          <Stack.Screen
            name="TeacherDashboard"
            component={TeacherDashboardScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: Colors.primary },
            headerTintColor: Colors.white,
            headerTitleStyle: { fontWeight: '600' },
          }}
        >
          <Stack.Screen
            name="StudentDashboard"
            component={StudentDashboardScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MarkAttendance"
            component={MarkAttendanceScreen}
            options={{ title: 'Mark Attendance' }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default RootNavigator;
