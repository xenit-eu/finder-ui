
node {

    stage 'Checkout'
    checkout scm

    def gitBranch = env.BRANCH_NAME 
    def buildNr = "SNAPSHOT"

    try {
        stage 'Node setup + npm install + TESTS'
        sh "./gradlew npmInstall npm_run_typings npm_run_lint npm_test --continue -i"

    } catch (err) {
        currentBuild.result = "FAILED"
    } finally {
        step([$class: "JUnitResultArchiver", testResults: "**/test-results/**/*.xml"])
    }

}
