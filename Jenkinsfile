
node {

    stage 'Checkout'
    checkout scm

    def gitBranch = env.BRANCH_NAME 
    def buildNr = "SNAPSHOT"

    try {
        stage 'Node setup + npm install + TESTS'
        sh "./gradlew npmInstall npm_run_typings npm_run_lint npm_test --stacktrace --debug --continue -i"

    } catch (err) {
        currentBuild.result = "FAILED"
        echo err
    } finally {
        step([$class: "JUnitResultArchiver", testResults: "**/test-results/**/*.xml"])
    }
}