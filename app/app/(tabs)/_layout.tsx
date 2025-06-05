import { Tabs } from "expo-router";
import { View, Text } from "react-native"; // ✅ Added Text here
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: 80,
        },
        tabBarLabel: () => null,
        tabBarLabelStyle: {
          fontSize: 12,
          color: "black"
        },
        tabBarIconStyle: {
          flex: 1
        },
        tabBarIcon: ({ focused, color }) => {
          let title;
          let iconName;
          let IconComponenet = Ionicons;

          switch (route.name) {
            case "chats":
              iconName = "chatbubble";
              title = "Chats";
              break;
            case "updates":
              IconComponenet = MaterialCommunityIcons;
              iconName = "update";
              title = "Updates";
              break;
            case "community":
              iconName = "people";
              title = "Community";
              break;
            case "calls":
              iconName = "call";
              title = "Calls";
              break;
            default:
              iconName = "home";
              break;
          }

          const iconColor = focused ? "#075E54" : "black";

          return (
            <View className="w-[100px] h-[58px] items-center justify-center">
              <View className={`${focused ? "bg-green-200" : "bg-transparent"} relative px-5 py-1.5 rounded-full`}>
                <IconComponenet size={18} name={iconName} color={iconColor} />
                {route.name === "chats" && <View className="absolute top-0 -right-0 bg-green-600 rounded-full px-1.5">
                  <Text className="text-white font-bold text-xs">5</Text>
                </View>}
                {route.name === "updates" && <View className="absolute top-0 -right-0 bg-green-600 rounded-full w-2 h-2">
                </View>}
              </View>
              <Text className={focused ? "font-semibold" : "font-normal"}>
                {title}
              </Text>


            </View>
          );
        },
      })}
    >
      <Tabs.Screen name="chats" />
      <Tabs.Screen name="updates" />
      <Tabs.Screen name="community" />
      <Tabs.Screen name="calls" />
    </Tabs>
  );
}
