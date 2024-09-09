import readline from "readline";

export default {
  listen: async (): Promise<string> => {
    const reader = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) => {
      reader.question("", (input: string) => {
        reader.close();
        resolve(input); // Resolve the promise with the input value
      });
    });
  },
};
