const core = require('@actions/core');
const github = require('@actions/github');
const { execSync } = require("child_process");

function exec(proc) {
    execSync(proc, { stdio: 'inherit' });
}

try {
    const llvmVersion = core.getInput('llvm-version');
    const env = core.getInput('env-var');
    core.info(`Installing LLVM version ${llvmVersion}...`);

    switch (process.platform) {
        case "win32": {
            const installLocation = "C:/llvm";
            switch (llvmVersion) {
                case "11.0.0": {
                    exec("mkdir " + installLocation);

                    exec("curl -LJO https://github.com/thirdsgames/llvm-binaries-win/releases/download/latest/llvm-11.0.0.bin.tar.gz");
                    exec("tar -xvf llvm-11.0.0.bin.tar.gz -C " + installLocation);
                    exec("rm llvm-11.0.0.bin.tar.gz");

                    exec("curl -LJO https://github.com/thirdsgames/llvm-binaries-win/releases/download/latest/llvm-11.0.0.lib.tar.gz");
                    exec("tar -xvf llvm-11.0.0.lib.tar.gz -C " + installLocation);
                    exec("rm llvm-11.0.0.lib.tar.gz");

                    exec("curl -LJO https://github.com/thirdsgames/llvm-binaries-win/releases/download/latest/llvm-11.0.0.include.tar.gz");
                    exec("tar -xvf llvm-11.0.0.include.tar.gz -C " + installLocation);
                    exec("rm llvm-11.0.0.include.tar.gz");

                    exec(installLocation + "/bin/llvm-config.exe --version");
                    if (env != "") {
                        core.exportVariable(env, installLocation);
                    }
                    break;
                }
                default: {
                    throw `LLVM version ${llvmVersion} not supported on Windows`
                }
            }
            break;
        }
        case "darwin": {
            throw "MacOS not supported yet"
            break;
        }
        default: {
            // Assume linux.
            const installLocationRoot = "/home/runner/llvm";
            exec("mkdir " + installLocationRoot);
            switch (llvmVersion) {
                case "11.1.0": {
                    const installLocation = installLocationRoot + "/clang+llvm-11.1.0-x86_64-linux-gnu-ubuntu-16.04";
                    exec("mkdir " + installLocation);
                    exec("curl -LJO https://github.com/llvm/llvm-project/releases/download/llvmorg-11.1.0/clang+llvm-11.1.0-x86_64-linux-gnu-ubuntu-16.04.tar.xz");
                    exec("tar -xvf clang+llvm-11.1.0-x86_64-linux-gnu-ubuntu-16.04.tar.xz -C " + installLocationRoot);
                    exec("rm clang+llvm-11.1.0-x86_64-linux-gnu-ubuntu-16.04.tar.xz");
                    exec(installLocation + "/bin/llvm-config --version");
                    if (env != "") {
                        core.info(`Setting environment variable ${env} to ${installLocation}.`);
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

    core.info("Installation complete!");
} catch (error) {
    core.setFailed(error.message);
}
