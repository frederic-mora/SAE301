<?php
require_once "src/Controller/EntityController.php";
require_once "src/Repository/CategoryRepository.php" ;


// This class inherits the jsonResponse method  and the $cnx propertye from the parent class Controller
// Only the process????Request methods need to be (re)defined.

class CategoryController extends EntityController {

    private CategoryRepository $categories;

    public function __construct(){
        $this->categories = new CategoryRepository();
    }

   
    protected function processGetRequest(HttpRequest $request) {
        $id = $request->getId("id");
        if ($id){
            // URI is .../categories/{id}
            $p = $this->categories->find($id);
            return $p==null ? false :  $p;
        }
        else{
            // URI is .../categories
            // $cat = $request->getParam("category"); // is there a category parameter in the request ?
            // if ( $cat == false) // no request category, return all categories
                return $this->categories->findAll();
            // else // return only categories of category $cat
            //     return $this->categories->findAllByCategory($cat);
        }
        $name = $request->getParam("name");
        if ($name){
            return $this->categories->findByName($name);
        }   
    }

    protected function processPostRequest(HttpRequest $request) {
        $json = $request->getJson();
        $obj = json_decode($json);
        $p = new Category(0); // 0 is a symbolic and temporary value since the category does not have a real id yet.
        $p->setName($obj->name);
       
        $ok = $this->categories->save($p); 
        return $ok ? $p : false;
    }
   
}

?>