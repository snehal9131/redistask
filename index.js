const Redis = require('ioredis')
const redis = new Redis(6379, 'localhost')
const prompt = require('prompt')

main()

function main() {
  console.log('1 : start')
  console.log('2 : stop')
  console.log('Enter your choice:')

  prompt.get(['choice'], function (err, result) {
    if (err) {
      console.log(err)
    }
    var num = result.choice
    switch (num) {
      case '1':
        startprocess()
        break
      case '2':
        process.exit()

      default:
        console.log('Enter valid option!')
    }
  })
}

const startprocess = () => {
  prompt.get(['user_id', 'username', 'password'], function (err, result) {
    if (err) {
      console.log(err)
    }
    redis.xadd(
      'user',
      '*',
      'user_id',
      result.user_id,
      'name',
      result.username,
      'password',
      result.password
    )
    redis.xread('STREAMS', 'user', 0).then((res) =>
      res.forEach((message) => {
        message.forEach((msg) => {
          console.log(msg)
          main()
        })
      })
    )
  })
}
