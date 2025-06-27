// In your navigation configuration file (likely App.js or a navigation file)
import SubscriptionScreen from './src/screens/SubscriptionScreen';

// Inside your Navigator component
<Stack.Navigator>
  {/* Other screens */}
  <Stack.Screen
    name="SubscriptionScreen"
    component={SubscriptionScreen}
    options={{ headerShown: false }}
  />
</Stack.Navigator>