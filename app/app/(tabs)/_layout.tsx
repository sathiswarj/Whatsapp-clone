import { Tabs } from "expo-router";
import { View } from "react-native";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: 60,
        },
        tabBarLabelStyle:{
          fontSize:12,
          color:"black"
        },
        tabBarIcon: ({focused, color}) => {
          let iconName;
          let IconComponenet = Ionicons;

          switch (route.name) {
            case "chats":
              iconName = "chatbubble";
              break;
            case "updates":
              IconComponenet = MaterialCommunityIcons;
              iconName = "update";
              break;
            case "community":
              iconName = "people";
              break;
            case "calls":
              iconName = "call";
              break;
            default:
              iconName = "home";
              break;
          }

          const iconColor = focused ? "#075E54" : "black";

          return (
            <View className="w-[58px] h-[58px] items-center justify-center">
              <View className= {`${focused ? "bg-green-200" : "bg-transparent"}px-5 py-1.5 rounded-full`}>
                <IconComponenet size={18} name={iconName} color={iconColor}/>
              </View>
            </View>
          );
        },
      })}
    >
      <Tabs.Screen name="chats" options={{ title: "Chats" }} />
      <Tabs.Screen name="updates" options={{ title: "Updates" }} />
      <Tabs.Screen name="community" options={{ title: "Communities" }} />
      <Tabs.Screen name="calls" options={{ title: "Calls" }} />
    </Tabs>
  );
}
