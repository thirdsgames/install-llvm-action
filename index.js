const core = require('@actions/core');
const github = require('@actions/github');
const { exec } = require("child_process");

try {
    const llvmVersion = core.getInput('llvm-version');
    const env = core.getInput('env-var');
    core.info(`Installing LLVM version ${llvmVersion}...`);

    switch (process.platform) {
        case "win32": {
            throw "Windows not supported yet"
            break;
        }
        case "darwin": {
            throw "MacOS not supported yet"
            break;
        }
        default: {
            // Assume linux.
            const installLocationRoot = "/home/runner/llvm";
            switch (llvmVersion) {
                case "11.1.0": {
                    const installLocation = installLocationRoot + "/clang+llvm-11.1.0-x86_64-linux-gnu-ubuntu-16.04";
                    exec("mkdir " + installLocation)
                    exec("curl -LJO https://github.com/llvm/llvm-project/releases/download/llvmorg-11.1.0/clang+llvm-11.1.0-x86_64-linux-gnu-ubuntu-16.04.tar.xz");
                    exec("tar -xvf clang+llvm-11.1.0-x86_64-linux-gnu-ubuntu-16.04.tar.xz -C " + installLocationRoot);
                    exec("rm clang+llvm-11.1.0-x86_64-linux-gnu-ubuntu-16.04.tar.xz");
                    exec(installLocation + "/bin/llvm-config --version");
                    if (env != "") {
                        core.exportVariable(env, installLocation);
                    }
                    break;
                }
                default: {
                    throw `LLVM version ${llvmVersion} not supported on Linux`
                }
            }
        }
    }

    core.info("Installation completed!");
} catch (error) {
    core.setFailed(error.message);
}
