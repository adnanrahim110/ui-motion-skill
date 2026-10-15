import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const capture = path.join(root, '.artifacts', 'capture');
const manifest = JSON.parse(fs.readFileSync(path.join(capture, 'manifest.json'), 'utf8'));
const font = process.env.DEMO_FONT ?? 'C:/Windows/Fonts/seguisb.ttf';
const fontFilter = font.replace(/\\/g, '/').replaceAll(':', '\\:');
const ffmpeg = process.env.FFMPEG ?? 'ffmpeg';
const outputs = [];
const duration = [];
const escape = (value) => value.replaceAll('\\', '\\\\').replaceAll("'", "'\\''");
for (const entry of manifest) {
  const directory = path.join(capture, entry.name);
  const scene = JSON.parse(fs.readFileSync(path.join(directory, 'scene.json'), 'utf8'));
  if (!scene.frames.length) throw new Error(`Empty capture: ${entry.name}`);
  const frames = [];
  const first = scene.frames[0].timestamp;
  for (let index = 0; index < scene.frames.length; index++) {
    const current = scene.frames[index];
    const next = scene.frames[index + 1];
    const hold = next ? next.timestamp - current.timestamp : scene.duration - (current.timestamp - first);
    frames.push(`file '${escape(path.join(directory, current.file).replace(/\\/g, '/'))}'`, `duration ${Math.max(0.02, hold).toFixed(6)}`);
  }
  frames.push(`file '${escape(path.join(directory, scene.frames.at(-1).file).replace(/\\/g, '/'))}'`);
  const list = path.join(directory, 'frames.ffconcat');
  const caption = path.join(directory, 'caption.txt');
  fs.writeFileSync(list, frames.join('\n'));
  fs.writeFileSync(caption, scene.caption);
  const captionPath = caption.replace(/\\/g, '/').replaceAll(':', '\\:');
  const mobile = scene.frames[0].width < 600;
  const layout = mobile
    ? 'scale=-2:900:flags=lanczos,pad=1920:1080:1152:132:color=0x142b45'
    : 'scale=1536:960:force_original_aspect_ratio=decrease:flags=lanczos,pad=1920:1080:(ow-iw)/2:96:color=0x142b45';
  const labels = `drawtext=fontfile='${fontFilter}':text='UI Motion':fontcolor=white:fontsize=30:x=64:y=30,drawtext=fontfile='${fontFilter}':textfile='${captionPath}':fontcolor=0xc8d8eb:fontsize=28:x=264:y=32`;
  const mobileLabel = mobile ? `,drawtext=fontfile='${fontFilter}':text='A native dialog.':fontcolor=white:fontsize=56:x=192:y=330,drawtext=fontfile='${fontFilter}':text='The same review flow.':fontcolor=white:fontsize=46:x=192:y=418,drawtext=fontfile='${fontFilter}':text='390 x 844 viewport':fontcolor=0xc8d8eb:fontsize=28:x=192:y=534` : '';
  const output = path.join(directory, 'clip.mp4');
  execFileSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', '-safe', '0', '-f', 'concat', '-i', list, '-t', String(scene.duration), '-vf', `${layout},setsar=1,fps=30,format=yuv420p,${labels}${mobileLabel}`, '-an', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', output], { cwd: root, stdio: 'inherit' });
  outputs.push(output);
  duration.push(scene.duration);
  console.log(`Edited ${entry.name}.`);
}
const inputs = outputs.flatMap((filename) => ['-i', filename]);
let filter = '';
let offset = duration[0];
let previous = '[0:v]';
for (let index = 1; index < outputs.length; index++) {
  offset -= 0.22;
  const next = `[v${index}]`;
  filter += `${previous}[${index}:v]xfade=transition=fade:duration=0.22:offset=${offset.toFixed(3)}${next};`;
  previous = next;
  offset += duration[index];
}
const output = path.join(root, 'docs', 'assets', 'ui-motion-demo.mp4');
execFileSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', ...inputs, '-filter_complex', filter.slice(0, -1), '-map', previous, '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', output], { cwd: root, stdio: 'inherit' });
console.log(`Saved ${output}`);
