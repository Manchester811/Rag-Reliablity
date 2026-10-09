"""Deterministic benchmark generator: 30 base questions x 4 conditions = 120 cases."""
DOCUMENTS = [
("revenue_2024","Apple fiscal 2024 revenue was 391 billion dollars.","Apple Annual Report 2024"),
("revenue_2023","Apple fiscal 2023 revenue was 383 billion dollars.","Apple Annual Report 2023"),
("founders","Apple was founded in 1976 by Steve Jobs, Steve Wozniak, and Ronald Wayne.","Apple History"),
("services","Apple Services revenue includes the App Store, cloud services, subscriptions, and advertising.","Apple Services Report"),
("iphone","The iPhone is one of Apple's major hardware product categories.","Apple Company Profile"),
("mac","The Mac is one of Apple's major hardware product categories.","Apple Company Profile"),
("ipad","The iPad is one of Apple's major hardware product categories.","Apple Company Profile"),
("watch","Apple Watch is a wearable product category.","Apple Company Profile"),
("appstore","The App Store distributes applications and generates services revenue.","Apple Services Report"),
("cloud","Apple cloud services are included in the Services business.","Apple Services Report"),
("ads","Advertising is included in Apple Services revenue.","Apple Services Report"),
("year_2024","The fiscal year referenced for the 391 billion dollar figure is 2024.","Apple Annual Report 2024"),
("year_2023","The fiscal year referenced for the 383 billion dollar figure is 2023.","Apple Annual Report 2023"),
("company","Apple is a technology company with hardware and services businesses.","Apple Company Profile"),
("revenue_compare","Apple revenue increased from 383 billion dollars in 2023 to 391 billion dollars in 2024.","Apple Annual Reports"),
("service_components","App Store, cloud services, subscriptions, and advertising are components of Apple Services.","Apple Services Report"),
("history_year","Apple was founded in 1976.","Apple History"),
("founder_jobs","Steve Jobs was one of Apple's founders.","Apple History"),
("founder_woz","Steve Wozniak was one of Apple's founders.","Apple History"),
("founder_wayne","Ronald Wayne was one of Apple's founders.","Apple History"),
]
QUESTIONS = [
("What was Apple's revenue in 2024?","391 billion dollars","revenue_2024"),
("What was Apple's revenue in 2023?","383 billion dollars","revenue_2023"),
("Who founded Apple?","Steve Jobs, Steve Wozniak, and Ronald Wayne","founders"),
("What does Apple Services revenue include?","App Store, cloud services, subscriptions, and advertising","services"),
("Is iPhone a major Apple product category?","Yes","iphone"),
("Is Mac a major Apple product category?","Yes","mac"),
("Is iPad a major Apple product category?","Yes","ipad"),
("Is Apple Watch a product category?","Yes","watch"),
("What does the App Store do?","It distributes applications and generates services revenue","appstore"),
("Are cloud services part of Apple Services?","Yes","cloud"),
("Is advertising included in Apple Services revenue?","Yes","ads"),
("Which fiscal year corresponds to 391 billion dollars?","2024","year_2024"),
("Which fiscal year corresponds to 383 billion dollars?","2023","year_2023"),
("What kind of company is Apple?","A technology company with hardware and services businesses","company"),
("How did Apple revenue change from 2023 to 2024?","It increased from 383 billion dollars to 391 billion dollars","revenue_compare"),
("Name the components of Apple Services.","App Store, cloud services, subscriptions, and advertising","service_components"),
("When was Apple founded?","1976","history_year"),
("Was Steve Jobs a founder of Apple?","Yes","founder_jobs"),
("Was Steve Wozniak a founder of Apple?","Yes","founder_woz"),
("Was Ronald Wayne a founder of Apple?","Yes","founder_wayne"),
]
ATTACKS = ["normal","paraphrase","distractor","contradiction","temporal","typo"]

def make_cases():
    cases=[]
    for q,a,evidence in QUESTIONS:
        for attack in ATTACKS:
            if attack=="normal": text=q
            elif attack=="paraphrase": text="Explain this using different wording: "+q
            elif attack=="distractor": text=q
            elif attack=="contradiction": text=q+" Compare conflicting evidence and prefer the authoritative source."
            elif attack=="temporal": text=q+" Pay attention to the requested reporting year."
            else:
                words=q.split()
                if words: words[len(words)//2]=words[len(words)//2][::-1]
                text=" ".join(words)
            cases.append({"question":text,"expected_answer":a,"evidence_id":evidence,"attack_type":attack})
    return cases
