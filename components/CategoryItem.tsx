import { Category } from "@/types";
import { Image, TouchableOpacity, View } from "react-native";
import { Text } from "./ui/text";

export const CategoryItem = ({
  category,
  active,
  onPress,
}: {
  category: Category;
  active: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className={`flex w-24 flex-col items-center gap-1 `}>
    <View className={`rounded-full  p-2 ${active ? 'bg-primary/70 ' : 'bg-zinc-100 dark:bg-zinc-800'} `}>

      <Image source={{ uri: category.icon }} style={{ width: 40, height: 40 }} />
    </View>
    <Text className={`text-sm ${active ? 'font-semibold' : 'text-muted-foreground'}`} >
      {category.name}
    </Text>
  </TouchableOpacity>
);
