export const javaTemplates = {
  helloWorld: {
    title: "Hello World",
    description: "Basic Java program structure",
    code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`
  },
  
  scanner: {
    title: "Scanner Input",
    description: "Reading user input with Scanner",
    code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        System.out.print("Enter your name: ");
        String name = scanner.nextLine();
        
        System.out.println("Hello, " + name + "!");
        
        scanner.close();
    }
}`
  },
  
  loops: {
    title: "Loops",
    description: "For and while loop examples",
    code: `public class Main {
    public static void main(String[] args) {
        // For loop example
        for (int i = 1; i <= 5; i++) {
            System.out.println("Count: " + i);
        }
        
        // While loop example
        int j = 1;
        while (j <= 3) {
            System.out.println("While: " + j);
            j++;
        }
    }
}`
  },
  
  arrays: {
    title: "Arrays",
    description: "Array declaration and manipulation",
    code: `public class Main {
    public static void main(String[] args) {
        // Array declaration and initialization
        int[] numbers = {1, 2, 3, 4, 5};
        
        // Print array elements
        for (int i = 0; i < numbers.length; i++) {
            System.out.println("Element " + i + ": " + numbers[i]);
        }
        
        // Enhanced for loop
        for (int num : numbers) {
            System.out.println("Number: " + num);
        }
    }
}`
  },
  
  conditionals: {
    title: "Conditionals",
    description: "If-else statements and switch cases",
    code: `public class Main {
    public static void main(String[] args) {
        int number = 10;
        
        // If-else statement
        if (number > 0) {
            System.out.println("Positive number");
        } else if (number < 0) {
            System.out.println("Negative number");
        } else {
            System.out.println("Zero");
        }
        
        // Switch statement
        int day = 3;
        switch (day) {
            case 1:
                System.out.println("Monday");
                break;
            case 2:
                System.out.println("Tuesday");
                break;
            case 3:
                System.out.println("Wednesday");
                break;
            default:
                System.out.println("Other day");
        }
    }
}`
  },
  
  methods: {
    title: "Methods",
    description: "Method declaration and usage",
    code: `public class Main {
    public static void main(String[] args) {
        // Call methods
        greetUser("Alice");
        
        int sum = addNumbers(5, 3);
        System.out.println("Sum: " + sum);
        
        double area = calculateArea(5.0);
        System.out.println("Circle area: " + area);
    }
    
    public static void greetUser(String name) {
        System.out.println("Hello, " + name + "!");
    }
    
    public static int addNumbers(int a, int b) {
        return a + b;
    }
    
    public static double calculateArea(double radius) {
        return Math.PI * radius * radius;
    }
}`
  }
};