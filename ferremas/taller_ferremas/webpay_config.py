from transbank.webpay.webpay_plus.configuration import Configuration

def get_webpay_configuration():
    return Configuration.for_testing_webpay_plus()
