Place the following files in this directory from your local Linux machine:
- libxcb.so.1.1.0
- libXau.so.6.0.0
- libXdmcp.so.6.0.0

Then create symlinks:
ln -s libxcb.so.1.1.0 libxcb.so.1
ln -s libXau.so.6.0.0 libXau.so.6
ln -s libXdmcp.so.6.0.0 libXdmcp.so.6

Commit and push these files to your repository, then pull in the restricted environment.
