export const fileToJson = <T>(file: File): Promise<T> => (
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(JSON.parse(reader.result));
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  })
);
