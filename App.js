import { useState, useEffect, useContext, memo } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { TaskItemsContext } from './contexts/TaskItemsContext';
import Home from './screens/Home';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import Register from './screens/Register';
import CustomDrawer from './components/CustomDrawer';
import { UserContext } from './contexts/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

export default function App() {

  const [taskItems, setTaskItems] = useState(TaskItemsContext._currentValue.taskItems)
  const [user, setUser] = useState(UserContext._currentValue.user)



  const [initialized, setInitialized] = useState(false)

  const Stack = createNativeStackNavigator();
  const Drawer = createDrawerNavigator();

  useEffect(() => {
    async function getUserFromStorage() {
      try {
        const userData = await AsyncStorage.getItem('user')
        if (userData !== null) {
          setUser(JSON.parse(userData))
        }
      } catch (error) {
        console.error('Error retrieving user data:', error)
      }

      setInitialized(true)
    }

    getUserFromStorage()
  }, [])



  useEffect(() => {
    if (initialized) {
      const storeData = async (value) => {
        try {
          const jsonValue = JSON.stringify(value)
          await AsyncStorage.setItem('user', jsonValue)
        } catch (e) {
          console.log(e)
        }
      }

      storeData(user)
    }

    return () => {
    };
  }, [initialized, user])




  const HomeDrawer = () => {

    return (

      <Drawer.Navigator
        screenOptions={{
          drawerStyle: {
            width: 280,
            backgroundColor: 'rgba(220,220,220,0.9)',
          },
        }}
        drawerContent={(props) => <CustomDrawer {...props} />}
        enableScreens={false}

      >
        <Drawer.Screen name="Home" component={Home} options={{ headerShown: false }} />
      </Drawer.Navigator>
    );
  };


  return (

    <UserContext.Provider value={{ user, setUser }} >
      <TaskItemsContext.Provider value={{ taskItems, setTaskItems }}  >
        <ActionSheetProvider>
          <NavigationContainer>



            <Stack.Navigator>
              {user ? (

                <Stack.Screen name="HomeDrawer" component={HomeDrawer} options={{ headerShown: false }} />

              ) : (
                <Stack.Group>
                  <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                  <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
                </Stack.Group>
              )}
            </Stack.Navigator>


          </NavigationContainer>
        </ActionSheetProvider>
      </TaskItemsContext.Provider>
    </UserContext.Provider >
  )
}



