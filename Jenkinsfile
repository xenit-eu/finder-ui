
node {

    stage 'Checkout'
    checkout scm

    def gitBranch = env.BRANCH_NAME 
    def buildNr = "SNAPSHOT"

    try {
        stage 'Node setup + npm install'
        sh "./gradlew npmInstall npm_run_typings --continue -i"

        state 'Unit tests'
        sh "./gradlew npm_test --continue -i"
        
    } catch (err) {
        currentBuild.result = "FAILED"
    } finally {
        step([$class: "JUnitResultArchiver", testResults: "**/test-results/**/*.xml"])
    }

}
