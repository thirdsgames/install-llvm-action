const core = require('@actions/core');
const github = require('@actions/github');
const { exec } = require("child_process");

function ex(proc) {
    var child = exec(proc);
    child.stdout.on('data', function (data) {
        core.info(data.toString());
    });
    child.stderr.on('data', function (data) {
        core.info(data.toString());
    });
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
                    ex("mkdir " + installLocation);

                    ex("curl -LJO https://github.com/thirdsgames/llvm-binaries-win/releases/download/latest/llvm-11.0.0.bin.tar.gz");
                    ex("tar -xvf llvm-11.0.0.bin.tar.gz -C " + installLocation);
                    ex("rm llvm-11.0.0.bin.tar.gz");

                    ex("curl -LJO https://github.com/thirdsgames/llvm-binaries-win/releases/download/latest/llvm-11.0.0.lib.tar.gz");
                    ex("tar -xvf llvm-11.0.0.lib.tar.gz -C " + installLocation);
                    ex("rm llvm-11.0.0.lib.tar.gz");

                    ex("curl -LJO https://github.com/thirdsgames/llvm-binaries-win/releases/download/latest/llvm-11.0.0.include.tar.gz");
                    ex("tar -xvf llvm-11.0.0.include.tar.gz -C " + installLocation);
                    ex("rm llvm-11.0.0.include.tar.gz");

                    ex(installLocation + "/bin/llvm-config.exe --version");
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
            switch (llvmVersion) {
                case "11.1.0": {
                    const installLocation = installLocationRoot + "/clang+llvm-11.1.0-x86_64-linux-gnu-ubuntu-16.04";
                    ex("mkdir " + installLocation);
                    ex("curl -LJO https://github.com/llvm/llvm-project/releases/download/llvmorg-11.1.0/clang+llvm-11.1.0-x86_64-linux-gnu-ubuntu-16.04.tar.xz");
                    ex("tar -xvf clang+llvm-11.1.0-x86_64-linux-gnu-ubuntu-16.04.tar.xz -C " + installLocationRoot);
                    ex("rm clang+llvm-11.1.0-x86_64-linux-gnu-ubuntu-16.04.tar.xz");
                    ex(installLocation + "/bin/llvm-config --version");
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
