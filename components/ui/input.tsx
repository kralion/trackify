import * as React from "react";
import { TextInput, type TextInputProps } from "react-native";
import { cn } from "~/lib/utils";

interface InputProps extends TextInputProps {
  size?: "sm" | "md" | "lg";
}

const Input = React.forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
  ({ className, placeholderClassName, size = "md", ...props }, ref) => {
    const sizeStyles = {
      sm: "web:h-8 native:h-10 text-sm",
      md: "web:h-10 native:h-12 text-base lg:text-sm native:text-lg",
      lg: "web:h-12 native:h-14 text-lg lg:text-base native:text-xl",
    };

    return (
      <TextInput
        ref={ref}
        className={cn(
          "web:flex web:w-full rounded-lg border border-input dark:border-border bg-background px-3 web:py-2 native:leading-[1.25] text-foreground web:ring-offset-background file:border-0 file:bg-transparent file:font-medium web:focus-visible:outline-none web:focus-visible:ring-2  placeholder:text-muted-foreground web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
          sizeStyles[size],
          props.editable === false && "opacity-50 web:cursor-not-allowed",
          className
        )}
        placeholderClassName={cn("text-muted-foreground", placeholderClassName)}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };