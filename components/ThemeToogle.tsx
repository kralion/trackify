import { MoonStar, Sun } from 'lucide-react-native';
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';
import { useColorScheme } from '~/lib/useColorScheme';
import { Button } from './ui/button';

export function ThemeToggle() {
  const { isDarkColorScheme, setColorScheme } = useColorScheme();

  function toggleColorScheme() {
    const newTheme = isDarkColorScheme ? 'light' : 'dark';
    setColorScheme(newTheme);
    setAndroidNavigationBar(newTheme);
  }

  return (
    <Button
      variant="ghost"
      className='rounded-full web:md:mr-4 mr-2'
      size="icon"
      onPress={toggleColorScheme}
    >
      {isDarkColorScheme ? (
        <MoonStar className='text-foreground' size={23} strokeWidth={1.25} />
      ) : (
        <Sun className='text-foreground' size={24} strokeWidth={1.25} />
      )}
    </Button>
  );
}