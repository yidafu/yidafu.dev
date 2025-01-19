# yidafu.dev

www.yidafu.dev

## Export Notebook to HTML

```bash
jupyter nbconvert --to html Perlin\ Noise.ipynb --embed-images
```


Get file modified time by Git.

```bash
echo "$(git log -1 --pretty=format:"%ad" --date iso -- README.md)";
```

Get file create time by Git.

```bash
echo "$(git log --pretty=format:"%ad" --date iso -- README.md | tail -1)";
```