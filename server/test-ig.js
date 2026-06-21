const yt = require('yt-dlp-exec');
async function test() {
  try {
    const info = await yt('https://www.instagram.com/p/CVexf3Usp00/', { dumpJson: true, ignoreNoFormatsError: true });
    console.log("Success:", Object.keys(info));
  } catch (err) {
    console.log("Error exit code:", err.exitCode);
    console.log("Stdout starts with:", err.stdout ? err.stdout.substring(0, 100) : 'none');
    if (err.stdout) {
       try {
          const json = JSON.parse(err.stdout);
          console.log("Parsed JSON:", Object.keys(json));
       } catch(e) {
          console.log("Not JSON");
       }
    }
  }
}
test();
