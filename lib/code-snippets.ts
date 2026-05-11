export type CodeLanguage = 
  | "javascript" 
  | "python" 
  | "c" 
  | "cpp" 
  | "go" 
  | "rust" 
  | "php" 
  | "zig" 
  | "java" 
  | "csharp";

export interface CodeSnippet {
  lines: string[];
}

const codeSnippets: Record<CodeLanguage, CodeSnippet[]> = {
  javascript: [
    { lines: ["function greet(name) {", "  return 'Hello, ' + name + '!';", "}", "", "console.log(greet('World'));"] },
    { lines: ["const add = (a, b) => a + b;", "", "const result = add(5, 3);", "console.log(result);"] },
    { lines: ["const numbers = [1, 2, 3, 4, 5];", "const doubled = numbers.map(n => n * 2);", "console.log(doubled);"] },
    { lines: ["async function fetchData() {", "  const response = await fetch('/api/data');", "  return response.json();", "}"] },
    { lines: ["const users = [{name: 'Alice', age: 25}, {name: 'Bob', age: 30}];", "const names = users.map(u => u.name);", "console.log(names);"] },
    { lines: ["function fibonacci(n) {", "  if (n <= 1) return n;", "  return fibonacci(n - 1) + fibonacci(n - 2);", "}"] },
    { lines: ["class Counter {", "  constructor() {", "    this.count = 0;", "  }", "  increment() {", "    this.count++;", "  }", "}"] },
    { lines: ["const debounce = (fn, delay) => {", "  let timeout;", "  return (...args) => {", "    clearTimeout(timeout);", "    timeout = setTimeout(() => fn(...args), delay);", "  };", "};"] },
    { lines: ["const nums = [5, 10, 15, 20, 25];", "const sum = nums.reduce((a, b) => a + b, 0);", "console.log(sum);"] },
    { lines: ["const data = { id: 1, name: 'Test', active: true };", "const { id, name } = data;", "console.log(id, name);"] },
  ],
  python: [
    { lines: ["def greet(name):", "    return f'Hello, {name}!'", "", "print(greet('World'))"] },
    { lines: ["numbers = [1, 2, 3, 4, 5]", "squared = [n ** 2 for n in numbers]", "print(squared)"] },
    { lines: ["def fibonacci(n):", "    if n <= 1:", "        return n", "    return fibonacci(n-1) + fibonacci(n-2)"] },
    { lines: ["users = [{'name': 'Alice', 'age': 25}, {'name': 'Bob', 'age': 30}]", "names = [u['name'] for u in users]", "print(names)"] },
    { lines: ["with open('file.txt', 'r') as f:", "    content = f.read()", "print(content)"] },
    { lines: ["def merge_sort(arr):", "    if len(arr) <= 1:", "        return arr", "    mid = len(arr) // 2", "    return merge(merge_sort(arr[:mid]), merge_sort(arr[mid:]))"] },
    { lines: ["class Calculator:", "    def add(self, a, b):", "        return a + b", "    def multiply(self, a, b):", "        return a * b"] },
    { lines: ["data = {'id': 1, 'name': 'Test', 'active': True}", "id, name = data['id'], data['name']", "print(id, name)"] },
    { lines: ["numbers = [1, 2, 3, 4, 5]", "total = sum(numbers)", "print(total)"] },
    { lines: ["def quicksort(arr):", "    if len(arr) <= 1:", "        return arr", "    pivot = arr[len(arr) // 2]", "    return quicksort([x for x in arr if x < pivot])"] },
  ],
  c: [
    { lines: ["#include <stdio.h>", "", "int main() {", "    printf(\"Hello, World!\\n\");", "    return 0;", "}"] },
    { lines: ["int add(int a, int b) {", "    return a + b;", "}", "", "int main() {", "    printf(\"%d\\n\", add(5, 3));", "    return 0;", "}"] },
    { lines: ["void swap(int *a, int *b) {", "    int temp = *a;", "    *a = *b;", "    *b = temp;", "}", "", "int main() {", "    int x = 5, y = 10;", "    swap(&x, &y);", "    return 0;", "}"] },
    { lines: ["int factorial(int n) {", "    if (n <= 1) return 1;", "    return n * factorial(n - 1);", "}", "", "int main() {", "    printf(\"%d\\n\", factorial(5));", "    return 0;", "}"] },
    { lines: ["typedef struct {", "    int id;", "    char name[50];", "    float score;", "} Student;", "", "int main() {", "    Student s = {1, \"Alice\", 95.5};", "    return 0;", "}"] },
    { lines: ["void bubbleSort(int arr[], int n) {", "    for (int i = 0; i < n - 1; i++) {", "        for (int j = 0; j < n - i - 1; j++) {", "            if (arr[j] > arr[j + 1]) {", "                int temp = arr[j];", "                arr[j] = arr[j + 1];", "                arr[j + 1] = temp;", "            }", "        }", "    }", "}"] },
    { lines: ["int main() {", "    int arr[] = {5, 10, 15, 20, 25};", "    int n = sizeof(arr) / sizeof(arr[0]);", "    for (int i = 0; i < n; i++) {", "        printf(\"%d \", arr[i]);", "    }", "    return 0;", "}"] },
    { lines: ["int binarySearch(int arr[], int l, int r, int x) {", "    if (r >= l) {", "        int mid = l + (r - l) / 2;", "        if (arr[mid] == x) return mid;", "        if (arr[mid] > x) return binarySearch(arr, l, mid - 1, x);", "        return binarySearch(arr, mid + 1, r, x);", "    }", "    return -1;", "}"] },
  ],
  cpp: [
    { lines: ["#include <iostream>", "using namespace std;", "", "int main() {", "    cout << \"Hello, World!\" << endl;", "    return 0;", "}"] },
    { lines: ["#include <iostream>", "#include <vector>", "using namespace std;", "", "int main() {", "    vector<int> nums = {1, 2, 3, 4, 5};", "    for (int n : nums) cout << n * 2 << \" \";", "    return 0;", "}"] },
    { lines: ["#include <iostream>", "using namespace std;", "", "class Rectangle {", "private:", "    int width, height;", "public:", "    Rectangle(int w, int h) : width(w), height(h) {}", "    int area() { return width * height; }", "};", "", "int main() {", "    Rectangle r(5, 3);", "    cout << r.area() << endl;", "    return 0;", "}"] },
    { lines: ["#include <iostream>", "#include <algorithm>", "using namespace std;", "", "int main() {", "    vector<int> v = {5, 2, 8, 1, 9};", "    sort(v.begin(), v.end());", "    for (int n : v) cout << n << \" \";", "    return 0;", "}"] },
    { lines: ["#include <iostream>", "using namespace std;", "", "template<typename T>", "T add(T a, T b) {", "    return a + b;", "}", "", "int main() {", "    cout << add(5, 3) << endl;", "    cout << add(2.5, 3.5) << endl;", "    return 0;", "}"] },
    { lines: ["#include <iostream>", "using namespace std;", "", "int fibonacci(int n) {", "    if (n <= 1) return n;", "    return fibonacci(n - 1) + fibonacci(n - 2);", "}", "", "int main() {", "    for (int i = 0; i < 10; i++)", "        cout << fibonacci(i) << \" \";", "    return 0;", "}"] },
    { lines: ["#include <iostream>", "using namespace std;", "", "int main() {", "    string s = \"Hello World\";", "    cout << s.length() << endl;", "    return 0;", "}"] },
  ],
  go: [
    { lines: ["package main", "", "import \"fmt\"", "", "func main() {", "    fmt.Println(\"Hello, World!\")", "}"] },
    { lines: ["package main", "", "import \"fmt\"", "", "func add(a, b int) int {", "    return a + b", "}", "", "func main() {", "    fmt.Println(add(5, 3))", "}"] },
    { lines: ["package main", "", "import \"fmt\"", "", "type User struct {", "    Name string", "    Age  int", "}", "", "func main() {", "    u := User{Name: \"Alice\", Age: 25}", "    fmt.Printf(\"%s is %d years old\\n\", u.Name, u.Age)", "}"] },
    { lines: ["package main", "", "import \"fmt\"", "", "func fibonacci(n int) int {", "    if n <= 1 {", "        return n", "    }", "    return fibonacci(n-1) + fibonacci(n-2)", "}", "", "func main() {", "    for i := 0; i < 10; i++ {", "        fmt.Printf(\"%d \", fibonacci(i))", "    }", "}"] },
    { lines: ["package main", "", "import \"fmt\"", "", "func sum(numbers []int) int {", "    total := 0", "    for _, n := range numbers {", "        total += n", "    }", "    return total", "}", "", "func main() {", "    nums := []int{1, 2, 3, 4, 5}", "    fmt.Println(sum(nums))", "}"] },
    { lines: ["package main", "", "import \"fmt\"", "", "type Shape interface {", "    Area() float64", "}", "", "type Rectangle struct {", "    Width, Height float64", "}", "", "func (r Rectangle) Area() float64 {", "    return r.Width * r.Height", "}", "", "func main() {", "    var s Shape = Rectangle{Width: 5, Height: 3}", "    fmt.Println(s.Area())", "}"] },
  ],
  rust: [
    { lines: ["fn main() {", "    println!(\"Hello, World!\");", "}"] },
    { lines: ["fn add(a: i32, b: i32) -> i32 {", "    a + b", "}", "", "fn main() {", "    println!(\"{}\", add(5, 3));", "}"] },
    { lines: ["struct User {", "    name: String,", "    age: u32,", "}", "", "impl User {", "    fn new(name: &str, age: u32) -> Self {", "        Self { name: name.to_string(), age }", "    }", "}", "", "fn main() {", "    let user = User::new(\"Alice\", 25);", "    println!(\"{} is {} years old\", user.name, user.age);", "}"] },
    { lines: ["fn fibonacci(n: u32) -> u32 {", "    match n {", "        0 => 0,", "        1 => 1,", "        _ => fibonacci(n - 1) + fibonacci(n - 2),", "    }", "}", "", "fn main() {", "    for i in 0..10 {", "        print!(\"{} \", fibonacci(i));", "    }", "}"] },
    { lines: ["fn main() {", "    let numbers = vec![1, 2, 3, 4, 5];", "    let sum: i32 = numbers.iter().sum();", "    println!(\"Sum: {}\", sum);", "}"] },
    { lines: ["fn main() {", "    let strings = vec![\"apple\", \"banana\", \"cherry\"];", "    for s in strings.iter() {", "        println!(\"{}\", s);", "    }", "}"] },
  ],
  php: [
    { lines: ["<?php", "echo \"Hello, World!\";", "?>"] },
    { lines: ["<?php", "function greet($name) {", "    return \"Hello, $name!\";", "}", "", "echo greet(\"World\");", "?>"] },
    { lines: ["<?php", "$numbers = [1, 2, 3, 4, 5];", "$doubled = array_map(fn($n) => $n * 2, $numbers);", "print_r($doubled);", "?>"] },
    { lines: ["<?php", "class User {", "    public $name;", "    public $age;", "", "    public function __construct($name, $age) {", "        $this->name = $name;", "        $this->age = $age;", "    }", "}", "", "$user = new User(\"Alice\", 25);", "echo \"{$user->name} is {$user->age} years old\";", "?>"] },
    { lines: ["<?php", "$users = [", "    ['name' => 'Alice', 'score' => 95],", "    ['name' => 'Bob', 'score' => 87],", "];", "$names = array_column($users, 'name');", "print_r($names);", "?>"] },
    { lines: ["<?php", "function fibonacci($n) {", "    if ($n <= 1) return $n;", "    return fibonacci($n - 1) + fibonacci($n - 2);", "}", "", "for ($i = 0; $i < 10; $i++) {", "    echo fibonacci($i) . \" \";", "}", "?>"] },
  ],
  zig: [
    { lines: ["const std = @import(\"std\");", "", "pub fn main() void {", "    std.debug.print(\"Hello, World!\\n\", .{});", "}"] },
    { lines: ["const std = @import(\"std\");", "", "fn add(a: i32, b: i32) i32 {", "    return a + b;", "}", "", "pub fn main() void {", "    std.debug.print(\"{}\\n\", .{add(5, 3)});", "}"] },
    { lines: ["const std = @import(\"std\");", "", "pub fn main() void {", "    var arr = [_]i32{ 5, 10, 15, 20, 25 };", "    for (arr) |n| {", "        std.debug.print(\"{} \", .{n});", "    }", "}"] },
    { lines: ["const std = @import(\"std\");", "", "fn fibonacci(n: u32) u32 {", "    if (n <= 1) return n;", "    return fibonacci(n - 1) + fibonacci(n - 2);", "}", "", "pub fn main() void {", "    for (0..10) |i| {", "        std.debug.print(\"{} \", .{fibonacci(i)});", "    }", "}"] },
    { lines: ["const std = @import(\"std\");", "", "pub fn main() void {", "    const users = [_]struct { name: []const u8, age: u32 }{", "        .{ .name = \"Alice\", .age = 25 },", "        .{ .name = \"Bob\", .age = 30 },", "    };", "    for (users) |u| {", "        std.debug.print(\"{} is {} \\n\", .{ u.name, u.age });", "    }", "}"] },
  ],
  java: [
    { lines: ["public class Main {", "    public static void main(String[] args) {", "        System.out.println(\"Hello, World!\");", "    }", "}"] },
    { lines: ["public class Main {", "    public static int add(int a, int b) {", "        return a + b;", "    }", "", "    public static void main(String[] args) {", "        System.out.println(add(5, 3));", "    }", "}"] },
    { lines: ["import java.util.Arrays;", "", "public class Main {", "    public static void main(String[] args) {", "        int[] numbers = {5, 2, 8, 1, 9};", "        Arrays.sort(numbers);", "        System.out.println(Arrays.toString(numbers));", "    }", "}"] },
    { lines: ["class User {", "    private String name;", "    private int age;", "", "    public User(String name, int age) {", "        this.name = name;", "        this.age = age;", "    }", "", "    public String getName() {", "        return name;", "    }", "}", "", "public class Main {", "    public static void main(String[] args) {", "        User u = new User(\"Alice\", 25);", "        System.out.println(u.getName());", "    }", "}"] },
    { lines: ["import java.util.List;", "import java.util.ArrayList;", "", "public class Main {", "    public static void main(String[] args) {", "        List<String> names = new ArrayList<>();", "        names.add(\"Alice\");", "        names.add(\"Bob\");", "        names.forEach(System.out::println);", "    }", "}"] },
  ],
  csharp: [
    { lines: ["using System;", "", "class Program {", "    static void Main() {", "        Console.WriteLine(\"Hello, World!\");", "    }", "}"] },
    { lines: ["using System;", "", "class Program {", "    static int Add(int a, int b) => a + b;", "", "    static void Main() {", "        Console.WriteLine(Add(5, 3));", "    }", "}"] },
    { lines: ["using System;", "using System.Linq;", "", "class Program {", "    static void Main() {", "        var numbers = new[] { 1, 2, 3, 4, 5 };", "        var doubled = numbers.Select(n => n * 2);", "        Console.WriteLine(string.Join(\" \", doubled));", "    }", "}"] },
    { lines: ["using System;", "", "class User {", "    public string Name { get; set; }", "    public int Age { get; set; }", "}", "", "class Program {", "    static void Main() {", "        var user = new User { Name = \"Alice\", Age = 25 };", "        Console.WriteLine($\"{user.Name} is {user.Age} years old\");", "    }", "}"] },
    { lines: ["using System;", "using System.Collections.Generic;", "", "class Program {", "    static void Main() {", "        var users = new List<User> {", "            new User { Name = \"Alice\", Score = 95 },", "            new User { Name = \"Bob\", Score = 87 },", "        };", "        var names = users.Select(u => u.Name);", "        Console.WriteLine(string.Join(\", \", names));", "    }", "}", "class User {", "    public string Name { get; set; }", "    public int Score { get; set; }", "}"] },
  ],
};

export const LANGUAGES: { value: CodeLanguage; label: string }[] = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "c", label: "C" },
  { value: "cpp", label: "C++" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "php", label: "PHP" },
  { value: "zig", label: "Zig" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#" },
];

export function generateCodeSnippet(language: CodeLanguage): string[] {
  const snippets = codeSnippets[language];
  const randomIndex = Math.floor(Math.random() * snippets.length);
  return snippets[randomIndex].lines;
}

export function getRandomLanguage(): CodeLanguage {
  const langKeys = Object.keys(codeSnippets) as CodeLanguage[];
  return langKeys[Math.floor(Math.random() * langKeys.length)];
}
